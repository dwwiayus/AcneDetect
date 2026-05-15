"""
routers/acne_skin.py
Endpoint TERPADU: Deteksi Tingkat Keparahan Jerawat + Rekomendasi Skincare
Python : 3.10.9

Alur:
  Gambar → CNN (NNEW Acne Level 0-3) → Profil skincare → Rekomendasi produk

Endpoint:
  POST /acne/analyze            → Deteksi jerawat + rekomendasi sekaligus
  POST /acne/analyze/batch      → Banyak gambar sekaligus
  GET  /acne/info               → Info kedua model
"""

import os
import io
import time
import pickle
import logging
import numpy as np
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel

import tensorflow as tf
from PIL import Image
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────
# KONFIGURASI
# ─────────────────────────────────────────────
CNN_MODEL_PATH      = os.getenv("CNN_MODEL_PATH",      "output/best_model.h5")
SKINCARE_MODEL_PATH = os.getenv("SKINCARE_MODEL_PATH", "output/skincare_cnn_integrated.pkl")

IMG_SIZE      = (128, 128)
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/jpg"}
MAX_FILE_SIZE = 10 * 1024 * 1024   # 10 MB

ACNE_LEVEL_INFO = {
    0: {
        "label"       : "Tingkat 0 — Tidak ada jerawat / sangat ringan",
        "deskripsi"   : "Kulit dalam kondisi baik. Fokus pada perawatan dan pencegahan.",
        "emoji"       : "🟢",
        "saran_dokter": False,
    },
    1: {
        "label"       : "Tingkat 1 — Jerawat ringan",
        "deskripsi"   : "Beberapa komedo atau jerawat kecil. Butuh perawatan rutin.",
        "emoji"       : "🔵",
        "saran_dokter": False,
    },
    2: {
        "label"       : "Tingkat 2 — Jerawat sedang",
        "deskripsi"   : "Jerawat cukup banyak. Perlu bahan aktif yang lebih targeted.",
        "emoji"       : "🟠",
        "saran_dokter": False,
    },
    3: {
        "label"       : "Tingkat 3 — Jerawat berat",
        "deskripsi"   : "Jerawat parah dan meluas. Skincare intensif dan konsultasi dokter disarankan.",
        "emoji"       : "🔴",
        "saran_dokter": True,
    },
}

# Bobot scoring skincare (harus sama dengan notebook)
WEIGHTS = {
    "cosine": 0.30,
    "skor"  : 0.30,
    "level" : 0.25,
    "kulit" : 0.15,
}

# ─────────────────────────────────────────────
# LOAD KEDUA MODEL
# ─────────────────────────────────────────────
cnn_model     = None
skin_bundle   = None

def load_models():
    global cnn_model, skin_bundle

    # Load CNN
    if Path(CNN_MODEL_PATH).exists():
        try:
            cnn_model = tf.keras.models.load_model(CNN_MODEL_PATH)
            logger.info(f"[Acne-Skin] CNN dimuat     : {CNN_MODEL_PATH}")
        except Exception as e:
            logger.error(f"[Acne-Skin] Gagal load CNN : {e}")
    else:
        logger.warning(f"[Acne-Skin] CNN tidak ditemukan di '{CNN_MODEL_PATH}'")

    # Load Skincare bundle
    if Path(SKINCARE_MODEL_PATH).exists():
        try:
            with open(SKINCARE_MODEL_PATH, "rb") as f:
                skin_bundle = pickle.load(f)
            n = skin_bundle.get("metadata", {}).get("total_produk", "?")
            logger.info(f"[Acne-Skin] Skincare dimuat : {SKINCARE_MODEL_PATH} ({n} produk)")
        except Exception as e:
            logger.error(f"[Acne-Skin] Gagal load skincare : {e}")
    else:
        logger.warning(f"[Acne-Skin] Skincare tidak ditemukan di '{SKINCARE_MODEL_PATH}'")

load_models()

# ─────────────────────────────────────────────
# ROUTER
# ─────────────────────────────────────────────
router = APIRouter()

# ─────────────────────────────────────────────
# SCHEMAS
# ─────────────────────────────────────────────
class AcneDetectionResult(BaseModel):
    acne_level       : int
    acne_label       : str
    acne_deskripsi   : str
    confidence       : float
    confidence_pct   : str
    probabilities    : dict   # {"Tingkat 0": 0.12, ...}
    saran_dokter     : bool

class SkincareProduct(BaseModel):
    rank          : int
    brand         : str
    produk        : str
    jenis_produk  : str
    bahan_aktif   : str
    untuk_kulit   : str
    level_utama   : str
    peringatan    : str
    skor_dataset  : int
    final_score   : float
    catatan       : str

class AnalyzeResponse(BaseModel):
    filename         : str
    inference_time_ms: float
    # Hasil deteksi jerawat
    acne             : AcneDetectionResult
    # Hasil rekomendasi skincare
    jenis_kulit      : str
    total_rekomendasi: int
    rekomendasi      : List[SkincareProduct]

class BatchAnalyzeResponse(BaseModel):
    total_images  : int
    total_time_ms : float
    results       : List[AnalyzeResponse]

class AcneModelInfo(BaseModel):
    cnn_loaded          : bool
    cnn_path            : str
    skincare_loaded     : bool
    skincare_path       : str
    acne_levels         : dict
    skincare_total_produk: Optional[int]
    skincare_kulit_options: Optional[List[str]]
    skincare_masalah_options: Optional[List[str]]

# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────
def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Bytes → numpy array (1, 128, 128, 3) siap untuk CNN."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE, Image.LANCZOS)
    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)


def run_cnn(tensor: np.ndarray) -> tuple:
    """Jalankan CNN → (level, probabilities, time_ms)."""
    t0    = time.perf_counter()
    probs = cnn_model.predict(tensor, verbose=0)[0]
    ms    = round((time.perf_counter() - t0) * 1000, 2)
    return int(np.argmax(probs)), probs, ms


def run_skincare(acne_level: int, jenis_kulit: str, top_n: int) -> List[dict]:
    """
    Jalankan rekomendasi skincare berdasarkan level jerawat + jenis kulit.
    Menggunakan profil CNN_TO_SKINCARE_PROFILE dari bundle.
    """
    profile_map = skin_bundle.get("cnn_to_skincare_profile", {})
    df          = skin_bundle["df"]
    tfidf       = skin_bundle["tfidf"]
    matrix      = skin_bundle["tfidf_matrix"]

    # Ambil profil dari mapping
    profile       = profile_map.get(acne_level, profile_map.get(0))
    target_levels = profile.get("skincare_levels", ["General"])
    masalah_list  = profile.get("masalah_default", ["Jerawat"])
    bahan_list    = profile.get("bahan_rekomendasi", ["Ceramide"])

    # Filter dataset berdasarkan level
    df_f = df[df["Level_Utama"].isin(target_levels)].copy()
    if len(df_f) < top_n:
        df_f = df.copy()

    # TF-IDF cosine similarity
    query_text = " ".join(masalah_list + [jenis_kulit] + bahan_list).lower()
    query_vec  = tfidf.transform([query_text])
    cos_sim    = cosine_similarity(query_vec, matrix).flatten()[df_f.index]

    # Rule-based score
    mask_masalah = df_f["Masalah Kulit"].isin(masalah_list).astype(float)
    mask_kulit   = (df_f["Untuk Kulit"].str.lower() == jenis_kulit.lower()).astype(float)
    mask_bahan   = df_f["Tipe_Bahan_Aktif_Final"].isin(bahan_list).astype(float) * 0.3
    mask_level   = df_f["Level_Utama"].isin(target_levels).astype(float)
    rule_score   = np.clip(mask_masalah * 0.4 + mask_kulit * 0.3 + mask_bahan, 0, 1)

    # Final score
    final = (
        WEIGHTS["cosine"] * cos_sim              +
        WEIGHTS["skor"]   * df_f["skor_norm"].values +
        WEIGHTS["level"]  * mask_level.values    +
        WEIGHTS["kulit"]  * rule_score.values
    )

    df_f = df_f.copy()
    df_f["final_score"] = final

    result = (
        df_f
        .sort_values("final_score", ascending=False)
        .drop_duplicates(subset=["Brand", "Produk"])
        .head(top_n)
        .reset_index(drop=True)
    )

    return [
        {
            "rank"        : i + 1,
            "brand"       : row["Brand"],
            "produk"      : row["Produk"],
            "jenis_produk": row["Jenis_Produk_Final"],
            "bahan_aktif" : row["Tipe_Bahan_Aktif_Final"],
            "untuk_kulit" : row["Untuk Kulit"],
            "level_utama" : row["Level_Utama"],
            "peringatan"  : row["warning1"],
            "skor_dataset": int(row["Skor_Rekomendasi"]),
            "final_score" : round(float(row["final_score"]), 4),
            "catatan"     : row["Catatan_Rekomendasi"],
        }
        for i, (_, row) in enumerate(result.iterrows())
    ]


def validate_file(file: UploadFile):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Format tidak didukung: '{file.content_type}'. Gunakan JPEG atau PNG."
        )


def build_response(filename: str, image_bytes: bytes,
                   jenis_kulit: str, top_n: int) -> AnalyzeResponse:
    """Jalankan full pipeline untuk satu gambar dan kembalikan AnalyzeResponse."""
    t_start = time.perf_counter()

    # Step 1: CNN
    tensor             = preprocess_image(image_bytes)
    level, probs, _    = run_cnn(tensor)
    info               = ACNE_LEVEL_INFO[level]

    # Step 2: Skincare
    rekomendasi = run_skincare(level, jenis_kulit, top_n)

    total_ms = round((time.perf_counter() - t_start) * 1000, 2)

    level_names = {0: "Tingkat 0", 1: "Tingkat 1", 2: "Tingkat 2", 3: "Tingkat 3"}

    return AnalyzeResponse(
        filename          = filename,
        inference_time_ms = total_ms,
        acne = AcneDetectionResult(
            acne_level     = level,
            acne_label     = info["label"],
            acne_deskripsi = info["deskripsi"],
            confidence     = round(float(probs[level]), 4),
            confidence_pct = f"{probs[level]*100:.2f}%",
            probabilities  = {level_names[i]: round(float(p), 4) for i, p in enumerate(probs)},
            saran_dokter   = info["saran_dokter"],
        ),
        jenis_kulit       = jenis_kulit,
        total_rekomendasi = len(rekomendasi),
        rekomendasi       = rekomendasi,
    )

# ─────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────
@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(
    file       : UploadFile = File(..., description="Foto wajah (JPEG/PNG)"),
    jenis_kulit: str        = "Berminyak",
    top_n      : int        = 5,
):
    """
    ## Analisis jerawat + rekomendasi skincare dalam satu request

    **Alur:**
    1. Upload foto wajah
    2. CNN mendeteksi **tingkat keparahan jerawat** (0–3)
    3. Sistem otomatis mencocokkan dengan **rekomendasi produk skincare**

    **Parameter:**
    - `file`        — foto wajah format JPEG atau PNG, maks 10 MB
    - `jenis_kulit` — `Berminyak` / `Kering` / `Normal` / `Kombinasi` / `Sensitif`
    - `top_n`       — jumlah rekomendasi yang ditampilkan (default: 5)

    **Response:**
    - Tingkat keparahan jerawat + confidence
    - Probabilitas tiap tingkat
    - Daftar produk skincare yang direkomendasikan
    - Peringatan konsultasi dokter (jika tingkat 3)
    """
    if cnn_model is None:
        raise HTTPException(503, "Model CNN belum dimuat. Pastikan best_model.h5 tersedia.")
    if skin_bundle is None:
        raise HTTPException(503, "Model skincare belum dimuat. Pastikan skincare_cnn_integrated.pkl tersedia.")

    validate_file(file)
    image_bytes = await file.read()
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(413, "Ukuran file melebihi 10 MB.")

    try:
        result = build_response(file.filename, image_bytes, jenis_kulit, top_n)
    except Exception as e:
        logger.error(f"[Acne-Skin] Error '{file.filename}': {e}")
        raise HTTPException(422, f"Gagal memproses gambar: {e}")

    logger.info(
        f"[Acne-Skin] '{file.filename}' → Level {result.acne.acne_level} "
        f"({result.acne.confidence_pct}) | {len(result.rekomendasi)} rekomendasi "
        f"[{result.inference_time_ms}ms]"
    )
    return result


@router.post("/analyze/batch", response_model=BatchAnalyzeResponse)
async def analyze_batch(
    files      : List[UploadFile] = File(..., description="Beberapa foto wajah"),
    jenis_kulit: str              = "Berminyak",
    top_n      : int              = 3,
):
    """
    ## Analisis banyak foto sekaligus

    Upload beberapa foto wajah → tiap foto mendapat deteksi jerawat
    dan rekomendasi skincare masing-masing.

    - `jenis_kulit` berlaku untuk semua foto dalam satu batch
    - `top_n` default 3 untuk efisiensi (bisa dinaikkan)
    """
    if cnn_model is None:
        raise HTTPException(503, "Model CNN belum dimuat.")
    if skin_bundle is None:
        raise HTTPException(503, "Model skincare belum dimuat.")
    if not files:
        raise HTTPException(400, "Tidak ada file yang dikirim.")

    t_start = time.perf_counter()
    results = []

    for file in files:
        validate_file(file)
        image_bytes = await file.read()
        try:
            r = build_response(file.filename, image_bytes, jenis_kulit, top_n)
            results.append(r)
        except Exception as e:
            logger.warning(f"[Acne-Skin] Gagal '{file.filename}': {e}")

    total_ms = round((time.perf_counter() - t_start) * 1000, 2)
    logger.info(f"[Acne-Skin] Batch {len(files)} gambar selesai [{total_ms}ms]")

    return BatchAnalyzeResponse(
        total_images  = len(files),
        total_time_ms = total_ms,
        results       = results,
    )


@router.get("/info", response_model=AcneModelInfo)
def acne_info():
    """Status dan informasi kedua model yang digunakan endpoint ini."""
    meta = skin_bundle.get("metadata", {}) if skin_bundle else {}
    return AcneModelInfo(
        cnn_loaded               = cnn_model is not None,
        cnn_path                 = CNN_MODEL_PATH,
        skincare_loaded          = skin_bundle is not None,
        skincare_path            = SKINCARE_MODEL_PATH,
        acne_levels              = {
            str(k): v["label"] for k, v in ACNE_LEVEL_INFO.items()
        },
        skincare_total_produk    = meta.get("total_produk"),
        skincare_kulit_options   = meta.get("kulit_options"),
        skincare_masalah_options = meta.get("masalah_options"),
    )
