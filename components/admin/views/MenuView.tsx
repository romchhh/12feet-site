"use client";

import { adminFetch } from "@/components/admin/adminApi";
import {
  AdminLoading,
  GhostButton,
  PrimaryButton,
} from "@/components/admin/AdminUi";
import styles from "@/components/admin/views/MenuView.module.css";
import type { CmsMenuColumn, CmsMenuItem } from "@/lib/cms/store";
import { useEffect, useMemo, useState } from "react";

function localId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function snapshot(menu: CmsMenuColumn[]) {
  return JSON.stringify(menu);
}

export default function MenuView() {
  const [menu, setMenu] = useState<CmsMenuColumn[]>([]);
  const [savedSnap, setSavedSnap] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err" | "dirty";
    text: string;
  } | null>(null);

  useEffect(() => {
    void adminFetch<{ ok: true; menu: CmsMenuColumn[] }>("/api/admin/menu")
      .then((data) => {
        setMenu(data.menu);
        setSavedSnap(snapshot(data.menu));
      })
      .finally(() => setLoading(false));
  }, []);

  const dirty = useMemo(
    () => Boolean(savedSnap) && snapshot(menu) !== savedSnap,
    [menu, savedSnap],
  );

  const itemCount = useMemo(
    () => menu.reduce((sum, col) => sum + col.items.length, 0),
    [menu],
  );

  useEffect(() => {
    if (!dirty) return;
    setMessage({ type: "dirty", text: "Есть несохранённые изменения" });
  }, [dirty]);

  function updateCategory(id: string, patch: Partial<CmsMenuColumn>) {
    setMenu((prev) =>
      prev.map((col) => (col.id === id ? { ...col, ...patch } : col)),
    );
  }

  function updateItem(catId: string, itemId: string, patch: Partial<CmsMenuItem>) {
    setMenu((prev) =>
      prev.map((col) => {
        if (col.id !== catId) return col;
        return {
          ...col,
          items: col.items.map((item) =>
            item.id === itemId ? { ...item, ...patch } : item,
          ),
        };
      }),
    );
  }

  function addCategory() {
    const next: CmsMenuColumn = {
      id: localId("cat"),
      heading: "Новая категория",
      items: [{ id: localId("item"), name: "", price: "" }],
    };
    setMenu((prev) => [...prev, next]);
  }

  function removeCategory(id: string) {
    const col = menu.find((c) => c.id === id);
    const label = col?.heading?.trim() || "эту категорию";
    if (!window.confirm(`Удалить «${label}» и все позиции?`)) return;
    setMenu((prev) => prev.filter((c) => c.id !== id));
  }

  function addItem(catId: string) {
    setMenu((prev) =>
      prev.map((col) => {
        if (col.id !== catId) return col;
        return {
          ...col,
          items: [...col.items, { id: localId("item"), name: "", price: "" }],
        };
      }),
    );
  }

  function removeItem(catId: string, itemId: string) {
    setMenu((prev) =>
      prev.map((col) => {
        if (col.id !== catId) return col;
        return {
          ...col,
          items: col.items.filter((item) => item.id !== itemId),
        };
      }),
    );
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const cleaned = menu.map((col) => ({
        ...col,
        heading: col.heading.trim(),
        items: col.items
          .map((item) => ({
            ...item,
            name: item.name.trim(),
            price: item.price.trim(),
          }))
          .filter((item) => item.name || item.price),
      }));
      await adminFetch("/api/admin/menu", {
        method: "PUT",
        body: JSON.stringify({ menu: cleaned }),
      });
      setMenu(cleaned);
      setSavedSnap(snapshot(cleaned));
      setMessage({ type: "ok", text: "Сохранено" });
    } catch {
      setMessage({ type: "err", text: "Ошибка сохранения" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminLoading />;

  const statusClass =
    message?.type === "ok"
      ? styles.statusOk
      : message?.type === "err"
        ? styles.statusErr
        : message?.type === "dirty"
          ? styles.statusDirty
          : "";

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.toolbarMeta}>
          <h2 className={styles.toolbarTitle}>Меню</h2>
          <p className={styles.toolbarLead}>
            {menu.length} кат. · {itemCount} поз. · видно на сайте после сохранения
          </p>
        </div>
        <div className={styles.toolbarActions}>
          <GhostButton type="button" onClick={addCategory}>
            + Категория
          </GhostButton>
          <PrimaryButton
            type="button"
            disabled={saving || !dirty}
            onClick={() => void save()}
          >
            {saving ? "…" : "Сохранить"}
          </PrimaryButton>
        </div>
      </div>

      {menu.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Меню пустое</p>
          <p className={styles.emptyLead}>
            Добавьте первую категорию — например «Кофе» или «Пиво».
          </p>
          <PrimaryButton type="button" onClick={addCategory}>
            + Добавить категорию
          </PrimaryButton>
        </div>
      ) : (
        <div className={styles.list}>
          {menu.map((col) => (
            <section key={col.id} className={styles.category}>
              <div className={styles.categoryHead}>
                <input
                  className={styles.categoryTitle}
                  value={col.heading}
                  placeholder="Название категории"
                  aria-label="Название категории"
                  onChange={(e) =>
                    updateCategory(col.id, { heading: e.target.value })
                  }
                />
                <span className={styles.count}>
                  {col.items.length} поз.
                </span>
                <button
                  type="button"
                  className={styles.iconDanger}
                  aria-label="Удалить категорию"
                  title="Удалить категорию"
                  onClick={() => removeCategory(col.id)}
                >
                  ×
                </button>
              </div>

              {col.items.length === 0 ? (
                <p className={styles.emptyItems}>Пока нет позиций</p>
              ) : (
                <div className={styles.items}>
                  {col.items.map((item) => (
                    <div key={item.id} className={styles.itemRow}>
                      <input
                        className={styles.itemInput}
                        value={item.name}
                        placeholder="Название"
                        aria-label="Название позиции"
                        onChange={(e) =>
                          updateItem(col.id, item.id, { name: e.target.value })
                        }
                      />
                      <input
                        className={styles.priceInput}
                        value={item.price}
                        placeholder="0,00 €"
                        aria-label="Цена"
                        onChange={(e) =>
                          updateItem(col.id, item.id, { price: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        className={styles.iconDanger}
                        aria-label="Удалить позицию"
                        title="Удалить"
                        onClick={() => removeItem(col.id, item.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                className={styles.addItem}
                onClick={() => addItem(col.id)}
              >
                + Добавить позицию
              </button>
            </section>
          ))}
        </div>
      )}

      <div className={styles.stickyBar}>
        <p className={`${styles.stickyMeta} ${statusClass}`}>
          {message?.text ||
            (dirty ? "Есть несохранённые изменения" : "Все изменения сохранены")}
        </p>
        <div className={styles.stickyActions}>
          <GhostButton type="button" onClick={addCategory}>
            + Категория
          </GhostButton>
          <PrimaryButton
            type="button"
            disabled={saving || !dirty}
            onClick={() => void save()}
          >
            {saving ? "Сохранение…" : "Сохранить"}
          </PrimaryButton>
        </div>
      </div>
    </>
  );
}
