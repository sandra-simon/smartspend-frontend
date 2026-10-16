
import api from "./api";

export type CategoryType = "income" | "expense";

export interface Category {
  category_id: number;
  name: string;
  icon: string;
  type: CategoryType;
  monthly_limit: number | string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryListResponse {
  categories: Category[];
}

export interface CategoryCreateRequest {
  name: string;
  icon: string;
  type: CategoryType;
}

export interface CategoryUpdateRequest {
  name?: string;
  icon?: string;
  type?: CategoryType;
}

export async function fetchAllCategories(): Promise<Category[]> {
  const response = await api.get<CategoryListResponse>("/categories");
  return response.data.categories;
}

export async function createCategory(
  data: CategoryCreateRequest,
): Promise<Category> {
  const response = await api.post<Category>("/categories", data);
  return response.data;
}

export async function updateCategory(
  categoryId: number,
  data: CategoryUpdateRequest,
): Promise<Category> {
  const response = await api.patch<Category>(
    `/categories/${categoryId}`,
    data,
  );
  return response.data;
}

export async function deleteCategory(
  categoryId: number,
): Promise<void> {
  await api.delete(`/categories/${categoryId}`);
}


export interface BudgetResponse {
  budget_id: number;
  category_id: number;
  year: number;
  month: number;
  limit_amount: number | string | null;
  created_at: string;
  updated_at: string;
}

export async function saveCategoryBudget(
  categoryId: number,
  limitAmount: number,
): Promise<BudgetResponse> {
  const response = await api.put<BudgetResponse>(
    `/categories/${categoryId}/budget`,
    { limit_amount: limitAmount },
  );

  return response.data;
}

export async function deleteCategoryBudget(
  categoryId: number,
): Promise<void> {
  await api.delete(`/categories/${categoryId}/budget`);
}

export async function fetchCategoryBudget(
  categoryId: number,
): Promise<BudgetResponse | null> {
  try {
    const response = await api.get<BudgetResponse>(
      `/categories/${categoryId}/budget`,
    );

    return response.data;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 404
    ) {
      return null;
    }

    throw error;
  }
}