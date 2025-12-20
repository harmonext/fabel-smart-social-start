export type FabelOnboardingDraft = {
  id?: string
  form_id: "fabel_onboarding_v1"
  current_step: number
  form_data: Record<string, any>
  status?: "draft" | "submitted"
}
