# -*- coding: utf-8 -*-
"""
Generator Gambar Simbol / Notasi UML Resmi untuk Tabel Daftar Simbol
Menghasilkan berkas PNG visual untuk setiap simbol diagram:
- Actor, Use Case, Association, System Boundary
- Initial Node, Action Node, Decision Node, Final Node, Swimlane
- Class Box, Lifeline, Synchronous Message, Return Message
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

SYMBOLS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uml_enterprise_architect", "symbols"))
os.makedirs(SYMBOLS_DIR, exist_ok=True)

def create_icon(name, draw_fn, size=(1.8, 1.2), dpi=200):
    fig, ax = plt.subplots(figsize=size, dpi=dpi)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    draw_fn(ax)
    out_path = os.path.join(SYMBOLS_DIR, name)
    plt.savefig(out_path, dpi=dpi, bbox_inches='tight', transparent=True)
    plt.close()
    return out_path

# 1. Actor
def draw_actor(ax):
    # Head
    ax.add_patch(patches.Circle((50, 72), 14, facecolor='#FFF2CC', edgecolor='#385D8A', linewidth=2))
    # Body
    ax.plot([50, 50], [58, 28], color='#385D8A', linewidth=2.4)
    # Arms
    ax.plot([25, 75], [44, 44], color='#385D8A', linewidth=2.4)
    # Legs
    ax.plot([50, 30], [28, 5], color='#385D8A', linewidth=2.4)
    ax.plot([50, 70], [28, 5], color='#385D8A', linewidth=2.4)

# 2. Use Case Oval
def draw_usecase(ax):
    box = patches.FancyBboxPatch((10, 25), 80, 50, boxstyle="round,pad=0.2,rounding_size=20",
                                 facecolor='#D8E8F8', edgecolor='#385D8A', linewidth=2)
    ax.add_patch(box)
    ax.text(50, 50, "Use Case", fontsize=10, fontweight='bold', color='#0F2942', ha='center', va='center')

# 3. Association
def draw_association(ax):
    ax.plot([10, 90], [50, 50], color='#385D8A', linewidth=2.5)
    ax.plot([10, 10], [42, 58], color='#385D8A', linewidth=2)
    ax.plot([90, 90], [42, 58], color='#385D8A', linewidth=2)

# 4. System Boundary
def draw_boundary(ax):
    ax.add_patch(patches.Rectangle((10, 10), 80, 80, fill=True, facecolor='#FCFDFF', edgecolor='#385D8A', linewidth=2, linestyle='--'))
    ax.text(50, 78, "System", fontsize=8.5, fontweight='bold', color='#1E395B', ha='center')

# 5. Initial Node
def draw_initial_node(ax):
    ax.add_patch(patches.Circle((50, 50), 20, facecolor='#000000', edgecolor='#000000'))

# 6. Action Node
def draw_action_node(ax):
    box = patches.FancyBboxPatch((10, 25), 80, 50, boxstyle="round,pad=0.2,rounding_size=12",
                                 facecolor='#EBF2F8', edgecolor='#385D8A', linewidth=2)
    ax.add_patch(box)
    ax.text(50, 50, "Aktivitas", fontsize=10, fontweight='bold', color='#0F2942', ha='center', va='center')

# 7. Decision Node
def draw_decision(ax):
    pts = [[50, 85], [85, 50], [50, 15], [15, 50]]
    ax.add_patch(patches.Polygon(pts, closed=True, facecolor='#FEFEE6', edgecolor='#8064A2', linewidth=2))

# 8. Activity Final Node
def draw_final_node(ax):
    ax.add_patch(patches.Circle((50, 50), 24, facecolor='#FFFFFF', edgecolor='#000000', linewidth=2))
    ax.add_patch(patches.Circle((50, 50), 15, facecolor='#000000', edgecolor='#000000'))

# 9. Swimlane
def draw_swimlane(ax):
    ax.add_patch(patches.Rectangle((10, 10), 80, 80, facecolor='#F8FAFC', edgecolor='#385D8A', linewidth=1.8))
    ax.plot([10, 90], [70, 70], color='#385D8A', linewidth=1.5)
    ax.text(50, 80, "Peran / Aktor", fontsize=8, fontweight='bold', color='#1E395B', ha='center')

# 10. Class Box
def draw_class_box(ax):
    ax.add_patch(patches.Rectangle((10, 10), 80, 80, facecolor='#FEFEE6', edgecolor='#8064A2', linewidth=1.8))
    ax.add_patch(patches.Rectangle((10, 62), 80, 28, facecolor='#F4EBF9', edgecolor='#8064A2', linewidth=1.8))
    ax.text(50, 75, "NamaKelas", fontsize=8.5, fontweight='bold', color='#333333', ha='center')
    ax.plot([10, 90], [38, 38], color='#8064A2', linewidth=1.2)
    ax.text(14, 48, "+ atribut", fontsize=7, color='#000000')
    ax.text(14, 22, "+ operasi()", fontsize=7, color='#000000')

# 11. Lifeline
def draw_lifeline(ax):
    box = patches.Rectangle((20, 65), 60, 25, facecolor='#EBF2F8', edgecolor='#385D8A', linewidth=1.6)
    ax.add_patch(box)
    ax.text(50, 77, ":Objek", fontsize=8, fontweight='bold', color='#0F2942', ha='center', va='center')
    ax.plot([50, 50], [65, 10], color='#888888', linestyle='--', linewidth=1.8)

# 12. Synchronous Message
def draw_sync_msg(ax):
    ax.annotate('', xy=(85, 50), xytext=(15, 50),
                arrowprops=dict(arrowstyle="-|>", color="#1E395B", lw=2, mutation_scale=15))
    ax.text(50, 62, "pesan()", fontsize=9, fontweight='bold', color='#1E395B', ha='center')

# 13. Return Message
def draw_return_msg(ax):
    ax.annotate('', xy=(15, 50), xytext=(85, 50),
                arrowprops=dict(arrowstyle="->", color="#555555", linestyle="dashed", lw=2, mutation_scale=15))
    ax.text(50, 62, "balasan", fontsize=9, color='#555555', ha='center')


if __name__ == "__main__":
    create_icon("sym_actor.png", draw_actor)
    create_icon("sym_usecase.png", draw_usecase)
    create_icon("sym_association.png", draw_association)
    create_icon("sym_boundary.png", draw_boundary)
    create_icon("sym_initial_node.png", draw_initial_node)
    create_icon("sym_action.png", draw_action_node)
    create_icon("sym_decision.png", draw_decision)
    create_icon("sym_final_node.png", draw_final_node)
    create_icon("sym_swimlane.png", draw_swimlane)
    create_icon("sym_class.png", draw_class_box)
    create_icon("sym_lifeline.png", draw_lifeline)
    create_icon("sym_sync_message.png", draw_sync_msg)
    create_icon("sym_return_message.png", draw_return_msg)
    print(f"[OK] 13 Simbol Ikon UML Visual berhasil dibuat di: {SYMBOLS_DIR}")
