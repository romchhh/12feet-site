"use client";

import { adminFetch } from "@/components/admin/adminApi";
import {
  AdminCard,
  AdminField,
  AdminLoading,
  AdminPageHeader,
  GhostButton,
  PrimaryButton,
} from "@/components/admin/AdminUi";
import styles from "@/components/admin/AdminUi.module.css";
import type { CmsMenuColumn, CmsMenuItem } from "@/lib/cms/store";
import { useEffect, useState } from "react";

function localId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function MenuView() {
  const [menu, setMenu] = useState<CmsMenuColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void adminFetch<{ ok: true; menu: CmsMenuColumn[] }>("/api/admin/menu")
      .then((data) => setMenu(data.menu))
      .finally(() => setLoading(false));
  }, []);

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
    setMenu((prev) => [
      ...prev,
      { id: localId("cat"), heading: "Нова категорія", items: [] },
    ]);
  }

  function removeCategory(id: string) {
    setMenu((prev) => prev.filter((col) => col.id !== id));
  }

  function addItem(catId: string) {
    setMenu((prev) =>
      prev.map((col) => {
        if (col.id !== catId) return col;
        return {
          ...col,
          items: [
            ...col.items,
            { id: localId("item"), name: "Нова позиція", price: "—" },
          ],
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
      await adminFetch("/api/admin/menu", {
        method: "PUT",
        body: JSON.stringify({ menu }),
      });
      setMessage("Меню збережено");
    } catch {
      setMessage("Помилка збереження");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminLoading />;

  return (
    <>
      <AdminPageHeader
        title="Меню"
        lead="Редагуйте категорії та позиції — зміни відображаються на головній сторінці."
        action={
          <>
            <GhostButton type="button" onClick={addCategory}>
              + Категорія
            </GhostButton>
            <PrimaryButton type="button" disabled={saving} onClick={() => void save()}>
              {saving ? "Збереження…" : "Зберегти"}
            </PrimaryButton>
          </>
        }
      />
      {message ? <p className={styles.tableHint}>{message}</p> : null}
      <div className={styles.stack}>
        {menu.map((col) => (
          <AdminCard key={col.id} title={col.heading || "Категорія"}>
            <div className={styles.formGrid}>
              <AdminField label="Заголовок">
                <input
                  value={col.heading}
                  onChange={(e) =>
                    updateCategory(col.id, { heading: e.target.value })
                  }
                />
              </AdminField>
              <div className={styles.formActions}>
                <GhostButton type="button" onClick={() => addItem(col.id)}>
                  + Позиція
                </GhostButton>
                <GhostButton type="button" onClick={() => removeCategory(col.id)}>
                  Видалити категорію
                </GhostButton>
              </div>
            </div>
            <div className={styles.stack} style={{ marginTop: 14 }}>
              {col.items.map((item) => (
                <div key={item.id} className={styles.formGrid}>
                  <AdminField label="Назва">
                    <input
                      value={item.name}
                      onChange={(e) =>
                        updateItem(col.id, item.id, { name: e.target.value })
                      }
                    />
                  </AdminField>
                  <AdminField label="Ціна">
                    <input
                      value={item.price}
                      onChange={(e) =>
                        updateItem(col.id, item.id, { price: e.target.value })
                      }
                    />
                  </AdminField>
                  <GhostButton
                    type="button"
                    onClick={() => removeItem(col.id, item.id)}
                  >
                    Видалити
                  </GhostButton>
                </div>
              ))}
            </div>
          </AdminCard>
        ))}
      </div>
    </>
  );
}
