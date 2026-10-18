import { useCallback, useEffect, useState } from "react";
import { Check, Pencil, PlusCircle, Trash2, Utensils, X } from "lucide-react";
import Button from "../atoms/Button";
import Card from "../atoms/Card";
import CategoryIconPicker from "../molecules/CategoryIconPicker";
import {
  createCategory,
  deleteCategory,
  fetchAllCategories,
  updateCategory,
  saveCategoryBudget,
  deleteCategoryBudget,
} from "../../services/categoryService";
import type { Category, CategoryType } from "../../services/categoryService";
import { getCategoryIcon } from "../../utils/categoryIcons";

interface CategoryFormState {
  name: string;
  icon: string;
  type: CategoryType;
  monthlyLimit: string;
}

const emptyForm: CategoryFormState = {
  name: "",
  icon: "",
  type: "expense",
  monthlyLimit: "",
};

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as {
        response?: {
          status?: number;
          data?: {
            detail?: {
              error?: { message?: string };
            };
          };
        };
      }
    ).response;

    if (response?.status === 409) {
      const message = response.data?.detail?.error?.message;

      if (
        message?.toLowerCase().includes("category_type_in_use") ||
        (message?.toLowerCase().includes("type") &&
          message?.toLowerCase().includes("transaction"))
      ) {
        return "You can't change this category's type because existing transactions use it. Create a new category with the desired type instead.";
      }

      if (
        message?.toLowerCase().includes("category_in_use") ||
        message?.toLowerCase().includes("transaction")
      ) {
        return "You can't delete this category because existing transactions use it. Delete or reassign those transactions first.";
      }

      return message ?? "This change conflicts with existing category data.";
    }

    return (
      response?.data?.detail?.error?.message ??
      "The request could not be completed."
    );
  }

  return "Something went wrong. Please try again.";
}

function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<CategoryFormState>(emptyForm);
  const [newForm, setNewForm] = useState<CategoryFormState>(emptyForm);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchAllCategories();
      setCategories(result);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadCategories();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadCategories]);

  function formFromCategory(category: Category): CategoryFormState {
    return {
      name: category.name,
      icon: category.icon,
      type: category.type,
      monthlyLimit:
        category.monthly_limit == null ? "" : String(category.monthly_limit),
    };
  }

  function startEditing(category: Category) {
    setEditingId(category.category_id);
    setEditForm(formFromCategory(category));
    setIsCreating(false);
    setError("");
    setNotice("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditForm(emptyForm);
    setError("");
  }

  async function saveCategory() {
    if (!editingId || !editForm.name.trim()) {
      setError("Category name is required.");
      return;
    }

    const monthlyLimit = editForm.monthlyLimit.trim();
    const parsedLimit = monthlyLimit === "" ? null : Number(monthlyLimit);

    if (
      editForm.type === "expense" &&
      parsedLimit !== null &&
      (!Number.isFinite(parsedLimit) || parsedLimit <= 0)
    ) {
      setError("Monthly limit must be greater than zero, or left empty.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const updatedCategory = await updateCategory(editingId, {
        name: editForm.name.trim(),
        icon: editForm.icon,
        type: editForm.type,
      });

      if (editForm.type === "expense") {
        if (parsedLimit === null) {
          await deleteCategoryBudget(editingId);
        } else {
          await saveCategoryBudget(editingId, parsedLimit);
        }
      }

      setCategories((current) =>
        current.map((category) =>
          category.category_id === editingId
            ? {
                ...updatedCategory,
                monthly_limit: editForm.type === "expense" ? parsedLimit : null,
              }
            : category,
        ),
      );

      await loadCategories();
      setEditingId(null);
      setNotice("Category updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateCategory() {
    const name = newForm.name.trim();
    const monthlyLimitText = newForm.monthlyLimit.trim();
    const monthlyLimit =
      monthlyLimitText === "" ? null : Number(monthlyLimitText);

    if (!name || !newForm.icon) {
      setError("Enter a category name and select an icon.");
      return;
    }

    if (
      newForm.type === "expense" &&
      monthlyLimit !== null &&
      (!Number.isFinite(monthlyLimit) || monthlyLimit <= 0)
    ) {
      setError("Monthly limit must be greater than zero, or left empty.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const created = await createCategory({
        name,
        icon: newForm.icon,
        type: newForm.type,
      });

      if (newForm.type === "expense" && monthlyLimit !== null) {
        await saveCategoryBudget(created.category_id, monthlyLimit);
      }

      setNewForm(emptyForm);
      setIsCreating(false);

      await loadCategories();
      setNotice("Category created successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
      await loadCategories();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!categoryToDelete) return;

    setDeletingId(categoryToDelete.category_id);
    setDeleteError("");

    try {
      await deleteCategory(categoryToDelete.category_id);

      setCategories((current) =>
        current.filter(
          (item) => item.category_id !== categoryToDelete.category_id,
        ),
      );

      setCategoryToDelete(null);
      setNotice("Category deleted successfully.");
    } catch (err) {
      setDeleteError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  function updateEditField<K extends keyof CategoryFormState>(
    key: K,
    value: CategoryFormState[K],
  ) {
    setEditForm((current) => ({ ...current, [key]: value }));
  }

  function updateNewField<K extends keyof CategoryFormState>(
    key: K,
    value: CategoryFormState[K],
  ) {
    setNewForm((current) => ({ ...current, [key]: value }));
  }

  function renderCategoryForm(
    form: CategoryFormState,
    updateField: <K extends keyof CategoryFormState>(
      key: K,
      value: CategoryFormState[K],
    ) => void,
    onSave: () => void,
    onCancel: () => void,
    saveLabel: string,
  ) {
    const SelectedIcon = getCategoryIcon(form.icon);

    return (
      <div className="mt-3 rounded-card bg-brand-soft/70 p-4 sm:p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-control bg-brand text-white">
              <SelectedIcon size={18} />
            </span>
            <h3 className="font-semibold text-brand">
              {saveLabel === "Save Changes"
                ? `Edit Category - ${form.name || "Untitled"}`
                : "Add New Tracking Category"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel editing"
            className="rounded-control p-1 text-text-secondary hover:bg-surface"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Category name
            </span>
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              maxLength={100}
              placeholder="e.g. Freelance"
              className="w-full rounded-control border border-border bg-surface px-3 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </label>

          <div className="space-y-1.5">
            <span className="block text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Icon
            </span>
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-control border border-border bg-surface px-3 py-3 text-sm [&::-webkit-details-marker]:hidden">
                {form.icon ? (
                  <SelectedIcon size={18} className="text-brand" />
                ) : (
                  <Utensils size={18} className="text-text-secondary" />
                )}
                <span className="flex-1 capitalize">
                  {form.icon || "Select icon"}
                </span>
                <span className="text-text-secondary">⌄</span>
              </summary>
              <div className="absolute left-0 top-full z-20 mt-2 w-[min(22rem,calc(100vw-3rem))] rounded-card border border-border bg-surface p-3 shadow-elevated">
                <CategoryIconPicker
                  value={form.icon}
                  onChange={(icon) => updateField("icon", icon)}
                />
              </div>
            </details>
          </div>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Type
            </span>
            <select
              value={form.type}
              onChange={(event) => {
                const type = event.target.value as CategoryType;
                updateField("type", type);
                if (type === "income") {
                  updateField("monthlyLimit", "");
                }
              }}
              className="w-full rounded-control border border-border bg-surface px-3 py-3 text-sm capitalize outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            >
              <option value="expense">🔴 Expense</option>
              <option value="income">🟢 Income</option>
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Monthly limit
            </span>
            {form.type === "expense" ? (
              <div className="flex items-center rounded-control border border-border bg-surface px-3 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
                <span className="text-sm text-text-secondary">₹</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.monthlyLimit}
                  onChange={(event) =>
                    updateField("monthlyLimit", event.target.value)
                  }
                  placeholder="Monthly limit"
                  className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none"
                />
              </div>
            ) : (
              <div className="rounded-control border border-border bg-surface-muted px-3 py-3 text-sm text-text-secondary">
                Not applicable
              </div>
            )}
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={saving}>
            <Check size={16} />
            {saving ? "Saving..." : saveLabel}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card padding="lg" className="space-y-5">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-brand">
          Category Management
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Customize expense and income tags used across your transactions and
          analytics.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-control border border-expense/20 bg-expense/10 px-4 py-3 text-sm text-expense-dark"
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="rounded-control bg-success-soft px-4 py-3 text-sm text-income-dark"
        >
          {notice}
        </div>
      )}

      {isLoading ? (
        <p className="py-6 text-sm text-text-secondary">
          Loading categories...
        </p>
      ) : categories.length === 0 ? (
        <p className="rounded-card bg-surface-muted p-5 text-sm text-text-secondary">
          No categories yet. Add your first tracking category below.
        </p>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.icon);
            const isEditing = editingId === category.category_id;

            return (
              <div key={category.category_id}>
                <div className="flex items-center gap-3 rounded-card bg-canvas p-3.5 sm:px-4">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-control ${
                      category.type === "income"
                        ? "bg-emerald-100 text-income-dark"
                        : "bg-brand-soft text-brand"
                    }`}
                  >
                    <Icon size={19} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-primary">
                      {category.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          category.type === "income"
                            ? "bg-emerald-100 text-income-dark"
                            : "bg-red-50 text-expense-dark"
                        }`}
                      >
                        {category.type === "income" ? "Income" : "Expense"}
                      </span>
                      {category.type === "expense" && (
                        <span className="text-xs text-text-secondary">
                          {category.monthly_limit == null
                            ? "No monthly limit"
                            : `₹${Number(category.monthly_limit).toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )} / month`}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Edit ${category.name}`}
                      onClick={() => startEditing(category)}
                      disabled={saving || deletingId !== null}
                      className="rounded-control p-2 text-text-secondary hover:bg-brand-soft hover:text-brand disabled:opacity-40"
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${category.name}`}
                      onClick={() => {
                        setCategoryToDelete(category);
                        setDeleteError("");
                      }}
                      disabled={saving || deletingId !== null}
                      className="rounded-control p-2 text-text-secondary hover:bg-expense/10 hover:text-expense-dark disabled:opacity-40"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                {isEditing &&
                  renderCategoryForm(
                    editForm,
                    updateEditField,
                    () => void saveCategory(),
                    cancelEditing,
                    "Save Changes",
                  )}
              </div>
            );
          })}
        </div>
      )}

      {!isCreating ? (
        <button
          type="button"
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
            setNewForm(emptyForm);
            setError("");
            setNotice("");
          }}
          className="flex w-full items-center gap-2 rounded-card bg-canvas p-4 text-left font-semibold text-brand hover:bg-brand-soft"
        >
          <PlusCircle size={19} />
          Add New Tracking Category
        </button>
      ) : (
        renderCategoryForm(
          newForm,
          updateNewField,
          () => void handleCreateCategory(),
          () => {
            setIsCreating(false);
            setNewForm(emptyForm);
            setError("");
          },
          "Add Category",
        )
      )}

      {categoryToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          onClick={() => {
            if (deletingId === null) {
              setCategoryToDelete(null);
              setDeleteError("");
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-category-title"
            className="w-full max-w-md rounded-panel bg-surface p-6 shadow-elevated"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <Trash2 size={23} />
            </div>

            <h2
              id="delete-category-title"
              className="mt-4 text-xl font-bold text-text-primary"
            >
              Delete category?
            </h2>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Delete “{categoryToDelete.name}”? Categories used by existing
              transactions cannot be deleted. This action cannot be undone.
            </p>

            {deleteError && (
              <p role="alert" className="mt-3 text-sm text-danger">
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                disabled={deletingId !== null}
                onClick={() => {
                  setCategoryToDelete(null);
                  setDeleteError("");
                }}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                disabled={deletingId !== null}
                onClick={() => void handleDelete()}
              >
                {deletingId !== null ? "Deleting..." : "Delete Category"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default CategoryManagement;
