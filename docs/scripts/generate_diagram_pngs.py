# -*- coding: utf-8 -*-
"""
Generator Diagram Arsitektur UML SmartInfra Beresolusi Tinggi (PNG 300 DPI)
Menggunakan Matplotlib & PIL dengan Standar Estetika Sparx Systems Enterprise Architect:
- Frame ganda tipis khas Enterprise Architect (#707070) dengan tab lipat
- Warna Use Case oval: Biru Pastel (#D8E8F8) dengan border #385D8A
- Warna Actor: Cream Pastel (#FFF2CC) dengan border #385D8A
- Warna Activity Action: Biru Lembut (#EBF2F8) & Kuning Pastel (#FFF2CC)
- Warna Class: Kuning Gading (#FEFEE6) dengan header ungu pastel (#F4EBF9)
- Layout luas & terstruktur rapi: Bebas tumpang tindih (Zero Overlap)
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.path import Path

DIAGRAMS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uml_enterprise_architect", "diagrams"))
os.makedirs(DIAGRAMS_DIR, exist_ok=True)

plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.family'] = 'sans-serif'

# ════════════════════════════════════════════════════════════════════════════
# 1. USE CASE DIAGRAM SMARTINFRA (HIGH RESOLUTION PNG)
# ════════════════════════════════════════════════════════════════════════════
def generate_use_case_png():
    fig, ax = plt.subplots(figsize=(17.5, 12.8), dpi=300)
    ax.set_xlim(0, 1750)
    ax.set_ylim(0, 1280)
    ax.axis('off')

    # EA Outer Double Frame
    ax.add_patch(patches.Rectangle((25, 25), 1700, 1230, fill=True, facecolor='#FFFFFF', edgecolor='#707070', linewidth=1.5))
    ax.add_patch(patches.Rectangle((29, 29), 1692, 1222, fill=False, edgecolor='#707070', linewidth=0.6))

    # EA Tab Header (Generously wide so slanted line never cuts text)
    tab_pts = [[25, 1255], [25, 1210], [800, 1210], [835, 1255]]
    ax.add_patch(patches.Polygon(tab_pts, closed=True, facecolor='#EAEAEA', edgecolor='#707070', linewidth=1.2))
    ax.text(45, 1232, "uc [Package] 01. Use Case Model [SmartInfra SPK System]", fontsize=9.5, fontweight='bold', color='#333333', va='center')

    # System Boundary Box: [260, 40] to [1470, 1190]
    ax.add_patch(patches.Rectangle((260, 40), 1210, 1150, fill=True, facecolor='#FCFDFF', edgecolor='#385D8A', linewidth=1.5, linestyle='--'))
    ax.text(280, 1160, "Sistem Pendukung Keputusan SmartInfra (Web Application)", fontsize=12.5, fontweight='bold', color='#1E395B')

    # Helper: Draw Actor Stickman (Ample vertical margins to prevent any touching)
    def draw_actor(x, y, title, subtitle="", tag="<<actor>>"):
        ax.text(x, y + 68, tag, fontsize=9, fontweight='bold', color='#385D8A', ha='center', va='bottom', zorder=5)
        ax.add_patch(patches.Circle((x, y + 38), 16, facecolor='#FFF2CC', edgecolor='#385D8A', linewidth=1.6, zorder=5))
        ax.plot([x, x], [y + 22, y - 18], color='#385D8A', linewidth=2.0, zorder=5)
        ax.plot([x - 28, x + 28], [y + 6, y + 6], color='#385D8A', linewidth=2.0, zorder=5)
        ax.plot([x, x - 22], [y - 18, y - 50], color='#385D8A', linewidth=2.0, zorder=5)
        ax.plot([x, x + 22], [y - 18, y - 50], color='#385D8A', linewidth=2.0, zorder=5)
        # 25px gap between feet (y-50) and title (y-75)
        ax.text(x, y - 75, title, fontsize=9.5, fontweight='bold', color='#111111', ha='center', va='top', zorder=5)
        if subtitle:
            ax.text(x, y - 95, subtitle, fontsize=8.2, fontweight='normal', color='#555555', ha='center', va='top', zorder=5)

    # Helper: Draw Use Case Oval (Wide enough for text + generous padding)
    def draw_uc(cx, cy, code, title, special=False):
        w, h = 280, 46
        bg = '#FEFEE6' if special else '#D8E8F8'
        border = '#8064A2' if special else '#385D8A'
        box = patches.FancyBboxPatch((cx - w/2, cy - h/2), w, h, boxstyle="round,pad=0.12,rounding_size=18",
                                     facecolor=bg, edgecolor=border, linewidth=1.4, zorder=4)
        ax.add_patch(box)
        ax.text(cx, cy, f"{code}: {title}", fontsize=8.2, fontweight='bold', color='#0F2942', ha='center', va='center', zorder=6)
        return (cx, cy)

    # Draw Actors
    draw_actor(120, 860, "Konsumen", "(Guest User)")
    draw_actor(120, 360, "Sales Consultant", "(Pramuniaga)")
    draw_actor(1610, 680, "Administrator", "(Super User)")

    # Columns configuration (Wide 145px corridors between columns for zero collisions)
    cx1 = 440      # Col 1: width 280 -> [300, 580]
    cx_mid = 865   # Center: width 280 -> [725, 1005]
    cx2 = 1290     # Col 2: width 280 -> [1150, 1430]

    # Draw Column 1 Use Cases (Konsumen & Sales)
    uc01 = draw_uc(cx1, 1040, "UC-01", "Eksplorasi Katalog")
    uc02 = draw_uc(cx1, 920,  "UC-02", "Konsultasi SPK SAW")
    uc03 = draw_uc(cx1, 800,  "UC-03", "Checkout Mandiri")
    uc04 = draw_uc(cx1, 680,  "UC-04", "Lacak Pesanan & Resi")
    uc05 = draw_uc(cx1, 550,  "UC-05", "Simulasi Kredit")
    uc06 = draw_uc(cx1, 430,  "UC-06", "Checkout Berbantuan")
    uc07 = draw_uc(cx1, 300,  "UC-07", "Monitoring Stok")
    uc08 = draw_uc(cx1, 160,  "UC-08", "Lacak Komisi Sales")

    # Draw Center Shared Auth Use Case
    uc09 = draw_uc(cx_mid, 490, "UC-09", "Otentikasi Sesi (JWT)", special=True)

    # Draw Column 2 Use Cases (Administrator)
    uc10 = draw_uc(cx2, 1020, "UC-10", "Kelola Data Laptop")
    uc11 = draw_uc(cx2, 880,  "UC-11", "Kelola Bobot SAW")
    uc12 = draw_uc(cx2, 740,  "UC-12", "Audit Perhitungan SAW")
    uc13 = draw_uc(cx2, 550,  "UC-13", "Verifikasi Pembayaran")
    uc14 = draw_uc(cx2, 360,  "UC-14", "Dashboard Eksekutif")

    # Helper: Association Lines (Actor to UC)
    def connect_actor(ax_pt, uc_pt):
        ax.plot([ax_pt[0], uc_pt[0]], [ax_pt[1], uc_pt[1]], color='#385D8A', linewidth=1.2, zorder=2)

    # Konsumen Connections (Line origin at x=195, clear of actor text)
    g_pt = (195, 860)
    connect_actor(g_pt, (300, 1040))  # UC-01
    connect_actor(g_pt, (300, 920))   # UC-02
    connect_actor(g_pt, (300, 800))   # UC-03
    connect_actor(g_pt, (300, 680))   # UC-04

    # Sales Connections (Line origin at x=195, clear of actor text)
    s_pt = (195, 360)
    connect_actor(s_pt, (300, 550))   # UC-05
    connect_actor(s_pt, (300, 430))   # UC-06
    connect_actor(s_pt, (300, 300))   # UC-07
    connect_actor(s_pt, (300, 160))   # UC-08

    # Admin Connections (Line target at x=1535, clear of actor text)
    a_pt = (1535, 680)
    connect_actor(a_pt, (1430, 1020)) # UC-10
    connect_actor(a_pt, (1430, 880))  # UC-11
    connect_actor(a_pt, (1430, 740))  # UC-12
    connect_actor(a_pt, (1430, 550))  # UC-13
    connect_actor(a_pt, (1430, 360))  # UC-14

    # Helper: UML Dependency Arrow (<<include>> / <<extend>>)
    def draw_dependency(p_from, p_to, label, curve_rad=0.0, label_offset=(0, 0)):
        is_inc = "include" in label
        line_color = '#1E4620' if is_inc else '#8A4100'
        arrow = patches.FancyArrowPatch(
            p_from, p_to,
            connectionstyle=f"arc3,rad={curve_rad}",
            linestyle="--",
            color=line_color,
            linewidth=1.3,
            arrowstyle="-|>",
            mutation_scale=11,
            zorder=3
        )
        ax.add_patch(arrow)
        mid_x = (p_from[0] + p_to[0]) / 2 + (curve_rad * 30) + label_offset[0]
        mid_y = (p_from[1] + p_to[1]) / 2 + label_offset[1]
        ax.text(
            mid_x, mid_y, label,
            fontsize=8.5, fontweight='bold',
            color=line_color,
            ha='center', va='center',
            bbox=dict(boxstyle="square,pad=0.22", facecolor="#FFFFFF", edgecolor=line_color, linewidth=0.6, alpha=0.95),
            zorder=7
        )

    # 1. Dependency: UC-04 (Lacak Pesanan) <<extend>> UC-03 (Checkout Mandiri)
    draw_dependency((cx1, 705), (cx1, 775), "<<extend>>")

    # 2. Dependency: UC-06 (Checkout Berbantuan) <<include>> UC-05 (Simulasi Kredit)
    draw_dependency((cx1, 455), (cx1, 525), "<<include>>")

    # 3. Dependency: UC-12 (Audit Perhitungan SAW) <<extend>> UC-11 (Kelola Bobot SAW)
    draw_dependency((cx2, 765), (cx2, 855), "<<extend>>")

    # 4. Dependency: UC-06 (Checkout Berbantuan) <<include>> UC-09 (Otentikasi Sesi JWT)
    draw_dependency((580, 430), (725, 490), "<<include>>")

    # 5. Dependency: UC-13 (Verifikasi Pembayaran) <<include>> UC-09 (Otentikasi Sesi JWT)
    draw_dependency((1150, 550), (1005, 490), "<<include>>")

    # Legend / Catatan Notasi Relasi di bagian tengah bawah (Lebar 380px agar bebas tumpang tindih)
    ax.add_patch(patches.Rectangle((675, 55), 380, 105, fill=True, facecolor='#F8F9FA', edgecolor='#AAAAAA', linewidth=0.8, zorder=4))
    ax.text(695, 138, "Keterangan Relasi Use Case:", fontsize=8.5, fontweight='bold', color='#333333', zorder=5)
    ax.plot([695, 725], [116, 116], color='#385D8A', linewidth=1.2, zorder=5)
    ax.text(735, 116, "Association (Garis Solid)", fontsize=8.0, color='#333333', va='center', zorder=5)
    ax.plot([695, 725], [94, 94], color='#1E4620', linestyle='--', linewidth=1.2, zorder=5)
    ax.text(735, 94, "<<include>> (Prasyarat Wajib)", fontsize=8.0, color='#1E4620', va='center', zorder=5)
    ax.plot([695, 725], [72, 72], color='#8A4100', linestyle='--', linewidth=1.2, zorder=5)
    ax.text(735, 72, "<<extend>> (Perluasan Opsional)", fontsize=8.0, color='#8A4100', va='center', zorder=5)

    out_path = os.path.join(DIAGRAMS_DIR, "01_Use_Case_Diagram_SmartInfra.png")
    plt.savefig(out_path, dpi=300, bbox_inches='tight', pad_inches=0.15)
    plt.close()
    print(f"[OK] Use Case Diagram PNG tersimpan: {out_path}")


# ════════════════════════════════════════════════════════════════════════════
# 2. ACTIVITY DIAGRAM: REKOMENDASI SPK SAW (HIGH RESOLUTION PNG)
# ════════════════════════════════════════════════════════════════════════════
def generate_activity_spk_png():
    fig, ax = plt.subplots(figsize=(10, 13), dpi=300)
    ax.set_xlim(0, 1000)
    ax.set_ylim(0, 1300)
    ax.axis('off')

    # EA Outer Double Frame
    ax.add_patch(patches.Rectangle((10, 10), 980, 1280, fill=True, facecolor='#FFFFFF', edgecolor='#707070', linewidth=1.5))
    ax.add_patch(patches.Rectangle((13, 13), 974, 1274, fill=False, edgecolor='#707070', linewidth=0.6))
    tab_pts = [[10, 1290], [10, 1255], [560, 1255], [590, 1290]]
    ax.add_patch(patches.Polygon(tab_pts, closed=True, facecolor='#EAEAEA', edgecolor='#707070', linewidth=1.2))
    ax.text(25, 1272, "act [Package] 02. Activity: Rekomendasi SPK SAW", fontsize=10, fontweight='bold', color='#333333', va='center')

    cx = 500

    def draw_action(y, text, subtext="", highlight=False, h=52):
        w = 480
        bg = '#FFF2CC' if highlight else '#EBF2F8'
        edge = '#D6B656' if highlight else '#385D8A'
        box = patches.FancyBboxPatch((cx - w/2, y - h/2), w, h, boxstyle="round,pad=0.2,rounding_size=15",
                                     facecolor=bg, edgecolor=edge, linewidth=1.4, zorder=4)
        ax.add_patch(box)
        if subtext:
            ax.text(cx, y + 8, text, fontsize=10, fontweight='bold', color='#0F2942', ha='center', va='center', zorder=5)
            ax.text(cx, y - 10, subtext, fontsize=8.5, color='#555555', ha='center', va='center', zorder=5)
        else:
            ax.text(cx, y, text, fontsize=10.5, fontweight='bold', color='#0F2942', ha='center', va='center', zorder=5)
        return y

    def draw_arrow(y_start, y_end):
        ax.annotate('', xy=(cx, y_end), xytext=(cx, y_start),
                    arrowprops=dict(arrowstyle="->", color="#385D8A", lw=1.6))

    # Initial Node
    ax.add_patch(patches.Circle((cx, 1180), 14, facecolor='#000000', edgecolor='#000000', zorder=5))
    draw_arrow(1166, 1116)

    # Actions
    draw_action(1090, "1. Memilih Persona Profil Kebutuhan", "(Mahasiswa, Desainer Grafis, atau Bobot Kustom)")
    draw_arrow(1064, 1006)

    draw_action(980, "2. Menentukan Batas Filter Tambahan", "(Maksimal Harga, Minimum RAM, dan Pilihan Brand)")
    draw_arrow(954, 896)

    draw_action(870, "3. Query Data Laptop Ready Stock dari Database", "(Membentuk Matriks Keputusan Awal X)")
    draw_arrow(844, 786)

    draw_action(750, "4. Normalisasi Matriks Keputusan R (Formula SAW)",
                "Benefit: r_ij = x_ij / max(x_j)  |  Cost: r_ij = min(x_j) / x_ij", highlight=True, h=65)
    draw_arrow(717, 646)

    draw_action(610, "5. Kalkulasi Nilai Preferensi V_i",
                "V_i = \u2211 (w_j \u00D7 r_ij) dan Konversi Match Percentage", highlight=True, h=65)
    draw_arrow(577, 506)

    draw_action(480, "6. Perangkingan Alternatif (Sorting Descending)", "(Menentukan Peringkat 1, 2, 3... berdasarkan V_i Tertinggi)")
    draw_arrow(454, 384)

    draw_action(358, "7. Menampilkan Halaman Rekomendasi Laptop Terbaik", "(Dilengkapi Skor Kecocokan, Rincian Spek, & Opsi Kredit)")
    draw_arrow(332, 260)

    # Decision / Action Pembeli
    draw_action(234, "8. Pembeli Memilih: Checkout Mandiri / Simulasi Kredit", "(Melanjutkan ke Transaksi Pembelian)")
    draw_arrow(208, 140)

    # Final Node
    ax.add_patch(patches.Circle((cx, 120), 16, facecolor='#FFFFFF', edgecolor='#000000', linewidth=1.6, zorder=4))
    ax.add_patch(patches.Circle((cx, 120), 10, facecolor='#000000', edgecolor='#000000', zorder=5))

    out_path = os.path.join(DIAGRAMS_DIR, "02_Activity_Diagram_SPK_SAW.png")
    plt.tight_layout()
    plt.savefig(out_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"[OK] Activity Diagram SPK SAW PNG tersimpan: {out_path}")


# ════════════════════════════════════════════════════════════════════════════
# 3. ACTIVITY DIAGRAM: ASSISTED CHECKOUT & APPROVAL (SWIMLANES)
# ════════════════════════════════════════════════════════════════════════════
def generate_activity_assisted_png():
    fig, ax = plt.subplots(figsize=(14, 11), dpi=300)
    ax.set_xlim(0, 1400)
    ax.set_ylim(0, 1100)
    ax.axis('off')

    # EA Outer Double Frame
    ax.add_patch(patches.Rectangle((10, 10), 1380, 1080, fill=True, facecolor='#FFFFFF', edgecolor='#707070', linewidth=1.5))
    ax.add_patch(patches.Rectangle((13, 13), 1374, 1074, fill=False, edgecolor='#707070', linewidth=0.6))
    
    # EA Tab Header (720px wide with generous clearance for long title)
    tab_pts = [[10, 1090], [10, 1055], [720, 1055], [750, 1090]]
    ax.add_patch(patches.Polygon(tab_pts, closed=True, facecolor='#EAEAEA', edgecolor='#707070', linewidth=1.2))
    ax.text(25, 1072, "act [Package] 02. Activity: Assisted Checkout & Maker-Checker Approval", fontsize=9.5, fontweight='bold', color='#333333', va='center')

    # 3 Swimlanes
    # Lane 1: Konsumen (30 - 450)
    ax.add_patch(patches.Rectangle((30, 40), 420, 1000, fill=True, facecolor='#FCFDFF', edgecolor='#385D8A', linewidth=1.2))
    ax.text(240, 1015, "Konsumen (Customer)", fontsize=12, fontweight='bold', color='#1E395B', ha='center')

    # Lane 2: Sales Consultant (450 - 920)
    ax.add_patch(patches.Rectangle((450, 40), 470, 1000, fill=True, facecolor='#F8FAFC', edgecolor='#385D8A', linewidth=1.2))
    ax.text(685, 1015, "Sales Consultant (Maker)", fontsize=12, fontweight='bold', color='#1E395B', ha='center')

    # Lane 3: Administrator (920 - 1370)
    ax.add_patch(patches.Rectangle((920, 40), 450, 1000, fill=True, facecolor='#FCFDFF', edgecolor='#385D8A', linewidth=1.2))
    ax.text(1145, 1015, "Administrator / Kasir (Checker)", fontsize=12, fontweight='bold', color='#1E395B', ha='center')

    def draw_box(x, y, w, h, text, sub="", bg='#EBF2F8', stroke='#385D8A'):
        box = patches.FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="round,pad=0.2,rounding_size=12",
                                     facecolor=bg, edgecolor=stroke, linewidth=1.3, zorder=4)
        ax.add_patch(box)
        if sub:
            ax.text(x, y + 6, text, fontsize=9.5, fontweight='bold', color='#0F2942', ha='center', va='center', zorder=5)
            ax.text(x, y - 9, sub, fontsize=8, color='#555555', ha='center', va='center', zorder=5)
        else:
            ax.text(x, y, text, fontsize=9.5, fontweight='bold', color='#0F2942', ha='center', va='center', zorder=5)

    # Initial Node in Sales Lane
    ax.add_patch(patches.Circle((685, 960), 12, facecolor='#000000', zorder=5))
    ax.annotate('', xy=(685, 915), xytext=(685, 948), arrowprops=dict(arrowstyle="->", color="#385D8A", lw=1.5))

    # Step 1: Sales Buka Kalkulator Kredit
    draw_box(685, 885, 340, 50, "1. Buka Kalkulator Kredit 10 Provider", "Simulasikan Tenor & DP Sesuai Budget")

    # Step 2: Konsumen Setuju Skema (Orthogonal clean route: left to x=240, down to y=810)
    ax.plot([515, 240], [885, 885], color="#385D8A", lw=1.5, zorder=3)
    ax.annotate('', xy=(240, 810), xytext=(240, 885), arrowprops=dict(arrowstyle="->", color="#385D8A", lw=1.5))
    draw_box(240, 785, 320, 48, "2. Memberikan Data Diri & Setuju Kredit", "Nama, WA, Alamat, Provider Dipilih")

    # Step 3: Sales Input Assisted Order (Orthogonal clean route: right to x=685, down to y=715)
    ax.plot([400, 685], [785, 785], color="#385D8A", lw=1.5, zorder=3)
    ax.annotate('', xy=(685, 715), xytext=(685, 785), arrowprops=dict(arrowstyle="->", color="#385D8A", lw=1.5))
    draw_box(685, 690, 340, 50, "3. Input Assisted Checkout di Portal Sales", "Otomatis Tercatat PIC Sales (salesId)", bg='#FFF2CC', stroke='#D6B656')

    # Step 4: Sistem Terbitkan Order PENDING
    ax.annotate('', xy=(685, 605), xytext=(685, 665), arrowprops=dict(arrowstyle="->", color="#385D8A", lw=1.5))
    draw_box(685, 580, 340, 50, "4. Pesanan Terbit Status PENDING", "Tercatat Nomor Faktur & Kode Bayar")

    # Step 5: Masuk ke Tab Admin
    ax.annotate('', xy=(980, 580), xytext=(855, 580), arrowprops=dict(arrowstyle="->", color="#385D8A", lw=1.5))
    draw_box(1145, 580, 330, 50, "5. Notifikasi Pesanan Masuk di Admin", "Tertera Badge: Assisted by PIC Sales")

    # Decision Node di Admin (Enlarged diamond: width 210, height 90, zero text overflow)
    ax.annotate('', xy=(1145, 485), xytext=(1145, 555), arrowprops=dict(arrowstyle="->", color="#385D8A", lw=1.5))
    diamond_pts = [[1145, 485], [1250, 440], [1145, 395], [1040, 440]]
    ax.add_patch(patches.Polygon(diamond_pts, closed=True, facecolor='#FEFEE6', edgecolor='#8064A2', linewidth=1.4, zorder=4))
    ax.text(1145, 446, "Validasi Bukti Bayar", fontsize=8.2, fontweight='bold', color='#4B2C68', ha='center', va='center', zorder=5)
    ax.text(1145, 434, "& Verifikasi Kredit?", fontsize=8.2, fontweight='bold', color='#4B2C68', ha='center', va='center', zorder=5)

    # Validasi OK (Yes)
    ax.text(1155, 365, "[ Disetujui ]", fontsize=8.5, fontweight='bold', color='#274E13')
    ax.annotate('', xy=(1145, 330), xytext=(1145, 395), arrowprops=dict(arrowstyle="->", color="#385D8A", lw=1.5))
    draw_box(1145, 305, 330, 50, "6. Admin Klik 'Verifikasi Pembayaran'", "Status Pesanan Berubah Menjadi LUNAS", bg='#D5E8D4', stroke='#82B366')

    # Step 7: Mutasi Stok Gudang Otomatis
    ax.annotate('', xy=(1145, 220), xytext=(1145, 280), arrowprops=dict(arrowstyle="->", color="#385D8A", lw=1.5))
    draw_box(1145, 195, 330, 48, "7. Sistem Memotong Stok Laptop Fisik", "Stok Berkurang Otomatis di Master Data")

    # Feedback ke Sales (Komisi) dan Konsumen (Faktur)
    ax.annotate('', xy=(855, 195), xytext=(980, 195), arrowprops=dict(arrowstyle="->", color="#385D8A", lw=1.5))
    draw_box(685, 195, 340, 48, "8. Komisi Sales Terakumulasi di KPI", "Status Pesanan Terupdate: Lunas")

    ax.annotate('', xy=(400, 195), xytext=(515, 195), arrowprops=dict(arrowstyle="->", color="#385D8A", lw=1.5))
    draw_box(240, 195, 320, 48, "9. Konsumen Terima Nota Lunas", "Unit Siap Diambil / Dikirimkan")

    # Final Node
    ax.annotate('', xy=(240, 116), xytext=(240, 171), arrowprops=dict(arrowstyle="->", color="#385D8A", lw=1.5))
    ax.add_patch(patches.Circle((240, 100), 16, facecolor='#FFFFFF', edgecolor='#000000', linewidth=1.6, zorder=4))
    ax.add_patch(patches.Circle((240, 100), 10, facecolor='#000000', edgecolor='#000000', zorder=5))

    out_path = os.path.join(DIAGRAMS_DIR, "03_Activity_Diagram_Assisted_Checkout.png")
    plt.tight_layout()
    plt.savefig(out_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"[OK] Activity Diagram Assisted Checkout PNG tersimpan: {out_path}")


# ════════════════════════════════════════════════════════════════════════════
# 4. CLASS DIAGRAM: LOGICAL DATA MODEL (HIGH RESOLUTION PNG)
# ════════════════════════════════════════════════════════════════════════════
def generate_class_diagram_png():
    fig, ax = plt.subplots(figsize=(15, 11), dpi=300)
    ax.set_xlim(0, 1500)
    ax.set_ylim(0, 1100)
    ax.axis('off')

    # EA Outer Double Frame
    ax.add_patch(patches.Rectangle((10, 10), 1480, 1080, fill=True, facecolor='#FFFFFF', edgecolor='#707070', linewidth=1.5))
    ax.add_patch(patches.Rectangle((13, 13), 1474, 1074, fill=False, edgecolor='#707070', linewidth=0.6))
    tab_pts = [[10, 1090], [10, 1055], [620, 1055], [650, 1090]]
    ax.add_patch(patches.Polygon(tab_pts, closed=True, facecolor='#EAEAEA', edgecolor='#707070', linewidth=1.2))
    ax.text(25, 1072, "class [Package] 03. Logical Data Model [Entity Classes]", fontsize=10, fontweight='bold', color='#333333', va='center')

    def draw_class(x, y, w, h, name, attrs):
        # Class Box
        ax.add_patch(patches.Rectangle((x, y), w, h, facecolor='#FEFEE6', edgecolor='#8064A2', linewidth=1.4, zorder=3))
        # Header Box
        header_h = 28
        ax.add_patch(patches.Rectangle((x, y + h - header_h), w, header_h, facecolor='#F4EBF9', edgecolor='#8064A2', linewidth=1.4, zorder=4))
        ax.text(x + w/2, y + h - 18, name, fontsize=11, fontweight='bold', color='#333333', ha='center', zorder=5)

        # Attribute lines
        cur_y = y + h - header_h - 18
        for attr in attrs:
            ax.text(x + 12, cur_y, attr, fontsize=8.5, color='#000000', zorder=5)
            cur_y -= 16

    # 1. User
    draw_class(50, 750, 240, 220, "User", [
        "+ id : Integer [PK]",
        "+ email : String",
        "+ passwordHash : String",
        "+ name : String",
        "+ role : Enum(admin, sales)",
        "+ createdAt : DateTime",
        "+ updatedAt : DateTime"
    ])

    # 2. Order
    draw_class(50, 280, 260, 360, "Order", [
        "+ id : Integer [PK]",
        "+ orderNumber : String [Unique]",
        "+ customerName : String",
        "+ customerEmail : String",
        "+ customerPhone : String",
        "+ shippingAddress : Text",
        "+ totalAmount : Decimal(15,2)",
        "+ paymentMethod : String",
        "+ paymentStatus : Enum(pending, paid)",
        "+ isCredit : Boolean",
        "+ creditTenor : Integer",
        "+ monthlyInstallment : Decimal(15,2)",
        "+ dpAmount : Decimal(15,2)",
        "+ financingProvider : String",
        "+ salesId : Integer [FK, Nullable]",
        "+ paidAt : DateTime",
        "+ createdAt : DateTime"
    ])

    # 3. OrderItem
    draw_class(410, 350, 230, 200, "OrderItem", [
        "+ id : Integer [PK]",
        "+ orderId : Integer [FK]",
        "+ laptopId : Integer [FK]",
        "+ quantity : Integer",
        "+ unitPrice : Decimal(15,2)",
        "+ subtotal : Decimal(15,2)"
    ])

    # 4. Laptop
    draw_class(750, 280, 280, 380, "Laptop", [
        "+ id : Integer [PK]",
        "+ brand : String",
        "+ model : String",
        "+ sku : String",
        "+ price : Decimal(15,2) [C1-Cost]",
        "+ stock : Integer",
        "+ processorName : String",
        "+ processorScore : Decimal(5,2) [C2-Ben]",
        "+ ramGb : Integer [C3-Ben]",
        "+ storageDesc : String",
        "+ storageGb : Integer [C4-Ben]",
        "+ gpuName : String",
        "+ gpuScore : Decimal(5,2) [C5-Ben]",
        "+ batteryHours : Decimal(4,1) [C6-Ben]",
        "+ weightKg : Decimal(4,2)",
        "+ imageUrl : MediumText",
        "+ description : Text"
    ])

    # 5. Criterion
    draw_class(1140, 750, 260, 180, "Criterion", [
        "+ id : Integer [PK]",
        "+ code : String(C1..C6)",
        "+ name : String",
        "+ type : String(cost, benefit)",
        "+ description : Text"
    ])

    # 6. LaptopCriteriaValue
    draw_class(1140, 420, 260, 180, "LaptopCriteriaValue", [
        "+ id : Integer [PK]",
        "+ laptopId : Integer [FK]",
        "+ criterionId : Integer [FK]",
        "+ rawValue : Decimal(12,2)"
    ])

    # 7. Profile (User Persona)
    draw_class(500, 760, 240, 180, "Profile", [
        "+ id : Integer [PK]",
        "+ name : String",
        "+ slug : String [Unique]",
        "+ description : Text",
        "+ iconName : String"
    ])

    # 8. ProfileCriteriaWeight
    draw_class(820, 760, 240, 180, "ProfileCriteriaWeight", [
        "+ id : Integer [PK]",
        "+ profileId : Integer [FK]",
        "+ criterionId : Integer [FK]",
        "+ weight : Decimal(5,4)"
    ])

    # Associations lines & multiplicities
    def connect_classes(pt1, pt2, mult1="1", mult2="*", label=""):
        ax.plot([pt1[0], pt2[0]], [pt1[1], pt2[1]], color='#385D8A', linewidth=1.4, zorder=2)
        mid_x = (pt1[0] + pt2[0]) / 2
        mid_y = (pt1[1] + pt2[1]) / 2

        # Determine orientation
        if abs(pt1[0] - pt2[0]) > abs(pt1[1] - pt2[1]):  # Horizontal
            dx1 = 6 if pt2[0] > pt1[0] else -18
            dx2 = -18 if pt2[0] > pt1[0] else 6
            ax.text(pt1[0] + dx1, pt1[1] + 5, mult1, fontsize=8.5, fontweight='bold', color='#333333')
            ax.text(pt2[0] + dx2, pt2[1] + 5, mult2, fontsize=8.5, fontweight='bold', color='#333333')
            if label:
                ax.text(mid_x, mid_y + 6, label, fontsize=8.5, color='#385D8A', ha='center', va='bottom')
        else:  # Vertical
            dy1 = -16 if pt2[1] < pt1[1] else 6
            dy2 = 6 if pt2[1] < pt1[1] else -16
            ax.text(pt1[0] + 6, pt1[1] + dy1, mult1, fontsize=8.5, fontweight='bold', color='#333333')
            ax.text(pt2[0] + 6, pt2[1] + dy2, mult2, fontsize=8.5, fontweight='bold', color='#333333')
            if label:
                ax.text(mid_x + 8, mid_y, label, fontsize=8.5, color='#385D8A', ha='left', va='center')

    # User -> Order (1 to 0..* PIC Sales)
    connect_classes((170, 750), (170, 640), "1", "0..*", "PIC Sales")

    # Order -> OrderItem (1 to 1..*)
    connect_classes((310, 450), (410, 450), "1", "1..*")

    # Laptop -> OrderItem (1 to 0..*)
    connect_classes((750, 450), (640, 450), "1", "0..*")

    # Laptop -> LaptopCriteriaValue (1 to 6)
    connect_classes((1030, 510), (1140, 510), "1", "6")

    # Criterion -> LaptopCriteriaValue (1 to *)
    connect_classes((1270, 750), (1270, 600), "1", "*")

    # Profile -> ProfileCriteriaWeight (1 to 6)
    connect_classes((740, 850), (820, 850), "1", "6")

    # Criterion -> ProfileCriteriaWeight (1 to *)
    connect_classes((1140, 850), (1060, 850), "1", "*")

    # Legend: Keterangan Notasi UML & Multiplisitas (Kardinalitas Relasi)
    leg_x, leg_y, leg_w, leg_h = 40, 45, 700, 200
    ax.add_patch(patches.Rectangle((leg_x, leg_y), leg_w, leg_h, fill=True, facecolor='#F8F9FA', edgecolor='#8064A2', linewidth=1.2, zorder=3))

    # Header strip
    ax.add_patch(patches.Rectangle((leg_x, leg_y + leg_h - 26), leg_w, 26, fill=True, facecolor='#F4EBF9', edgecolor='#8064A2', linewidth=1.2, zorder=4))
    ax.text(leg_x + leg_w/2, leg_y + leg_h - 13, "Keterangan Notasi UML & Multiplisitas (Kardinalitas Relasi)", fontsize=9.5, fontweight='bold', color='#333333', ha='center', va='center', zorder=5)

    # Column 1: Multiplisitas Relasi (Kardinalitas)
    c1_x = leg_x + 14
    ax.text(c1_x, leg_y + leg_h - 45, "Multiplisitas Relasi (Kardinalitas):", fontsize=8.8, fontweight='bold', color='#1E395B', zorder=5)
    ax.text(c1_x, leg_y + leg_h - 68, "1             : Tepat satu entitas (One / Mandatori)", fontsize=7.8, color='#222222', zorder=5)
    ax.text(c1_x, leg_y + leg_h - 88, "0..* / *     : Nol sampai banyak (Many / Opsional)", fontsize=7.8, color='#222222', zorder=5)
    ax.text(c1_x, leg_y + leg_h - 108, "1..*         : Minimal satu atau banyak (One or More)", fontsize=7.8, color='#222222', zorder=5)
    ax.text(c1_x, leg_y + leg_h - 128, "6             : Tepat 6 entitas (Kriteria SAW: C1..C6)", fontsize=7.8, color='#222222', zorder=5)
    ax.text(c1_x, leg_y + leg_h - 150, "1 ke 0..*    : Relasi One-to-Many (1:N)", fontsize=7.8, fontweight='bold', color='#1E4620', zorder=5)
    ax.text(c1_x, leg_y + leg_h - 170, "M:N Junction : Relasi Many-to-Many (via OrderItem, dll)", fontsize=7.8, fontweight='bold', color='#8A4100', zorder=5)

    # Separator vertical line
    ax.plot([leg_x + 365, leg_x + 365], [leg_y + 10, leg_y + leg_h - 32], color='#CCCCCC', linewidth=1.0, linestyle='--', zorder=4)

    # Column 2: Notasi Simbol & Komponen Kelas
    c2_x = leg_x + 380
    ax.text(c2_x, leg_y + leg_h - 45, "Notasi Simbol & Komponen Kelas:", fontsize=8.8, fontweight='bold', color='#1E395B', zorder=5)
    ax.text(c2_x, leg_y + leg_h - 68, "+ (Plus)        : Visibility Public (Dapat diakses modul lain)", fontsize=7.8, color='#222222', zorder=5)
    ax.text(c2_x, leg_y + leg_h - 88, "[PK]             : Primary Key (Kunci pengenal unik tabel)", fontsize=7.8, color='#222222', zorder=5)
    ax.text(c2_x, leg_y + leg_h - 108, "[FK]             : Foreign Key (Kunci relasi ke tabel induk)", fontsize=7.8, color='#222222', zorder=5)
    ax.text(c2_x, leg_y + leg_h - 128, "[Unique]      : Atribut wajib unik / tidak boleh kembar", fontsize=7.8, color='#222222', zorder=5)
    ax.text(c2_x, leg_y + leg_h - 150, "Garis Solid   : Association Line (Relasi antar-kelas)", fontsize=7.8, color='#222222', zorder=5)
    ax.text(c2_x, leg_y + leg_h - 170, "PIC Sales      : Role Name (Peran relasi pada asosiasi)", fontsize=7.8, color='#222222', zorder=5)

    out_path = os.path.join(DIAGRAMS_DIR, "04_Class_Diagram_Logical_Data_Model.png")
    plt.tight_layout()
    plt.savefig(out_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"[OK] Class Diagram PNG tersimpan: {out_path}")


# ════════════════════════════════════════════════════════════════════════════
# 5. SEQUENCE DIAGRAM: SPK SAW EXECUTION (HIGH RESOLUTION PNG)
# ════════════════════════════════════════════════════════════════════════════
# ════════════════════════════════════════════════════════════════════════════
# 5. SEQUENCE DIAGRAM: SPK SAW EXECUTION (HIGH RESOLUTION PNG)
# ════════════════════════════════════════════════════════════════════════════
def generate_sequence_spk_png():
    fig, ax = plt.subplots(figsize=(16.0, 10.5), dpi=300)
    ax.set_xlim(0, 1600)
    ax.set_ylim(0, 1040)
    ax.axis('off')

    # EA Outer Double Frame
    ax.add_patch(patches.Rectangle((10, 10), 1580, 1020, fill=True, facecolor='#FFFFFF', edgecolor='#707070', linewidth=1.5))
    ax.add_patch(patches.Rectangle((13, 13), 1574, 1014, fill=False, edgecolor='#707070', linewidth=0.6))
    tab_pts = [[10, 1030], [10, 995], [580, 995], [610, 1030]]
    ax.add_patch(patches.Polygon(tab_pts, closed=True, facecolor='#EAEAEA', edgecolor='#707070', linewidth=1.2))
    ax.text(25, 1012, "sd [Package] 04. Sequence: Rekomendasi Laptop SAW", fontsize=10, fontweight='bold', color='#333333', va='center')

    # Lifelines with generous, perfectly balanced spacing
    lifelines = [
        (120, "User / Sales\n(Client)", True),
        (440, ":WebClient\n(Vue.js 3)", False),
        (790, ":SPKController\n(API Route)", False),
        (1140, ":SAWService\n(Engine)", False),
        (1490, ":Database\n(MySQL 8)", False),
    ]

    for lx, lname, is_actor in lifelines:
        if is_actor:
            ax.add_patch(patches.Circle((lx, 940), 14, facecolor='#FFF2CC', edgecolor='#385D8A', linewidth=1.5, zorder=5))
            ax.text(lx, 900, lname, fontsize=9.5, fontweight='bold', color='#000000', ha='center', zorder=5)
        else:
            box = patches.Rectangle((lx - 75, 910), 150, 44, facecolor='#EBF2F8', edgecolor='#385D8A', linewidth=1.4, zorder=4)
            ax.add_patch(box)
            ax.text(lx, 932, lname, fontsize=9, fontweight='bold', color='#0F2942', ha='center', va='center', zorder=5)

        # Dashed Lifeline
        ax.plot([lx, lx], [900 if is_actor else 910, 60], color='#888888', linestyle='--', linewidth=1.2, zorder=1)

    def draw_msg(y, x1, x2, text, is_return=False, text_x=None):
        style = "dashed" if is_return else "solid"
        color = "#555555" if is_return else "#1E395B"
        start_x = x1 + 7 if x2 > x1 else x1 - 7
        end_x = x2 - 7 if x2 > x1 else x2 + 7
        ax.annotate('', xy=(end_x, y), xytext=(start_x, y),
                    arrowprops=dict(arrowstyle="->", color=color, linestyle=style, lw=1.3),
                    zorder=2)
        mid_x = (x1 + x2) / 2 if text_x is None else text_x
        # Wrapped text with pad guarantees zero collisions with lifelines or bars
        ax.text(mid_x, y + 5, text, fontsize=8.2, color='#000000', ha='center', va='bottom',
                linespacing=1.2, zorder=6,
                bbox=dict(boxstyle='square,pad=0.2', facecolor='#FFFFFF', edgecolor='none', alpha=0.95))

    def draw_self_msg(y, x, text):
        x_bar_right = x + 7
        pts = [
            (x_bar_right, y + 14),
            (x_bar_right + 25, y + 14),
            (x_bar_right + 25, y - 14),
            (x_bar_right, y - 14)
        ]
        ax.plot([pts[0][0], pts[1][0]], [pts[0][1], pts[1][1]], color='#1E395B', lw=1.3, zorder=4)
        ax.plot([pts[1][0], pts[2][0]], [pts[1][1], pts[2][1]], color='#1E395B', lw=1.3, zorder=4)
        ax.annotate('', xy=pts[3], xytext=pts[2],
                    arrowprops=dict(arrowstyle="->", color='#1E395B', lw=1.3),
                    zorder=4)
        ax.text(x_bar_right + 34, y, text, fontsize=8.2, color='#000000', ha='left', va='center',
                linespacing=1.2, zorder=6,
                bbox=dict(boxstyle='square,pad=0.2', facecolor='#FFFFFF', edgecolor='none', alpha=0.95))

    # Activation Bars with accurate UML lifecycle
    def add_activation(x, y_top, y_bot):
        ax.add_patch(patches.Rectangle((x - 7, y_bot), 14, y_top - y_bot, facecolor='#FFFFFF', edgecolor='#385D8A', linewidth=1.2, zorder=3))

    add_activation(120, 825, 140)    # User / Sales
    add_activation(440, 825, 140)    # WebClient
    add_activation(790, 750, 215)    # SPKController
    add_activation(1490, 675, 600)   # Database: active only during Query & Return (3 to 4)
    add_activation(1140, 525, 290)   # SAWService: active only during Calculation (5 to 8)

    # Messages with clean 2-line wrapped text (wide margins, zero overflow)
    draw_msg(825, 120, 440, "1. Pilih Profil 'Mahasiswa'\n& Filter Harga")
    draw_msg(750, 440, 790, "2. POST /api/spk/recommend\n{profile_id: 1, filters}")
    # Messages 3 & 4 cross SAWService; text is placed at x=965 (midpoint of span 790 to 1140)
    draw_msg(675, 790, 1490, "3. Query Alternatif Ready Stock\n& Bobot Kriteria", text_x=965)
    draw_msg(600, 1490, 790, "4. Return Data Mentah Alternatif\n(Matriks X)", is_return=True, text_x=965)
    draw_msg(525, 790, 1140, "5. calculateSAW(alternatives,\ncriteria, weights)")
    # Self-messages on SAWService have ample space (from 1174 to 1490 is 316px wide)
    draw_self_msg(450, 1140, "6. Normalisasi Matriks R\n(Formula Benefit/Cost)")
    draw_self_msg(370, 1140, "7. Hitung Preferensi V_i\n& Sorting Peringkat")
    draw_msg(290, 1140, 790, "8. Return Hasil Rekomendasi\nTerurut", is_return=True)
    draw_msg(215, 790, 440, "9. JSON Response\n{success: true, results: [...] }", is_return=True)
    draw_msg(140, 440, 120, "10. Render Hasil Rekomendasi\n& Match % di Layar", is_return=True)

    out_path = os.path.join(DIAGRAMS_DIR, "05_Sequence_Diagram_SPK_SAW.png")
    plt.tight_layout()
    plt.savefig(out_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"[OK] Sequence Diagram SPK SAW PNG tersimpan: {out_path}")



if __name__ == "__main__":
    print("--- Merender Ulang Semua Diagram UML (PNG 300 DPI - Bebas Tumpang Tindih) ---")
    generate_use_case_png()
    generate_activity_spk_png()
    generate_activity_assisted_png()
    generate_class_diagram_png()
    generate_sequence_spk_png()
    print("--- Selesai Merender Semua Diagram PNG ---")
