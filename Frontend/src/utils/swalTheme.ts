import Swal from "sweetalert2";

/**
 * Shared SweetAlert2 styling so every dialog in the app looks like it belongs
 * to the same design system (rounded cards, primary-purple actions, stacked
 * full-width buttons) instead of each call site inventing its own classes.
 *
 * Buttons are always full-width and stacked (confirm on top, cancel below) —
 * mirrors the pattern already used on PaymentResultPage and reads cleanly on
 * mobile, where these dialogs are hardest to get right.
 */
export const swalClasses = {
  popup: "rounded-3xl shadow-2xl border border-surface-variant !p-6 sm:!p-8 text-left",
  title: "!text-xl sm:!text-2xl font-bold text-primary-dark !mt-1 text-left w-full",
  htmlContainer: "text-on-surface-variant !mt-2 !mb-0 text-left w-full",
  actions: "!flex !flex-col w-full gap-2.5 !mt-6",
  confirmPrimary:
    "w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer",
  confirmDanger:
    "w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer",
  confirmSuccess:
    "w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer",
  cancel:
    "w-full border-2 border-surface-variant text-on-surface-variant font-bold py-3 px-4 rounded-xl hover:bg-surface-container hover:border-outline-variant transition-colors cursor-pointer",
  inputLabel: "!text-sm font-bold text-on-surface !mb-1.5 text-left w-full block",
  input:
    "!w-full border border-surface-variant rounded-xl bg-surface-container focus:ring-2 focus:ring-primary/20 focus:border-primary p-3 font-medium text-on-surface outline-none transition-all resize-none min-h-[100px] shadow-inner",
} as const;

/** Centered swal for the common case of a single dismiss/OK button. */
const oneButtonActions = "!flex !flex-col w-full gap-2.5 !mt-6 max-w-[240px] mx-auto";

interface AlertOptions {
  title: string;
  text?: string;
  html?: string;
}

/** Generic "something went wrong" dialog — replaces the ~8 near-identical error Swal.fire calls across the app. */
export function showErrorAlert({ title = "Something went wrong", text, html }: Partial<AlertOptions> = {}) {
  return Swal.fire({
    icon: "error",
    title,
    text,
    html,
    confirmButtonText: "OK",
    buttonsStyling: false,
    customClass: {
      popup: swalClasses.popup,
      title: `${swalClasses.title} text-center`,
      htmlContainer: `${swalClasses.htmlContainer} text-center`,
      actions: oneButtonActions,
      confirmButton: swalClasses.confirmPrimary,
    },
  });
}

export function showSuccessAlert({ title, text, html }: AlertOptions) {
  return Swal.fire({
    icon: "success",
    title,
    text,
    html,
    confirmButtonText: "Great!",
    buttonsStyling: false,
    customClass: {
      popup: swalClasses.popup,
      title: `${swalClasses.title} text-center`,
      htmlContainer: `${swalClasses.htmlContainer} text-center`,
      actions: oneButtonActions,
      confirmButton: swalClasses.confirmPrimary,
    },
  });
}

export function showInfoAlert({ title, text, html }: AlertOptions) {
  return Swal.fire({
    icon: "info",
    title,
    text,
    html,
    confirmButtonText: "Got it",
    buttonsStyling: false,
    customClass: {
      popup: swalClasses.popup,
      title: `${swalClasses.title} text-center`,
      htmlContainer: `${swalClasses.htmlContainer} text-center`,
      actions: oneButtonActions,
      confirmButton: swalClasses.confirmPrimary,
    },
  });
}

export function showWarningAlert({ title, text, html }: AlertOptions) {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    html,
    confirmButtonText: "OK",
    buttonsStyling: false,
    customClass: {
      popup: swalClasses.popup,
      title: `${swalClasses.title} text-center`,
      htmlContainer: `${swalClasses.htmlContainer} text-center`,
      actions: oneButtonActions,
      confirmButton: swalClasses.confirmPrimary,
    },
  });
}

interface ConfirmOptions {
  title: string;
  text?: string;
  html?: string;
  icon?: "warning" | "question" | "info";
  confirmText: string;
  cancelText?: string;
  /** Use the red confirm button for destructive/irreversible actions (ban, deactivate, reject). */
  danger?: boolean;
}

/** Two-button confirm dialog. Resolves true only when the user confirms. */
export async function confirmDialog({
  title,
  text,
  html,
  icon = "question",
  confirmText,
  cancelText = "Cancel",
  danger = false,
}: ConfirmOptions): Promise<boolean> {
  const result = await Swal.fire({
    icon,
    title,
    text,
    html,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    buttonsStyling: false,
    customClass: {
      popup: swalClasses.popup,
      title: `${swalClasses.title} text-center`,
      htmlContainer: `${swalClasses.htmlContainer} text-center`,
      actions: swalClasses.actions,
      confirmButton: danger ? swalClasses.confirmDanger : swalClasses.confirmPrimary,
      cancelButton: swalClasses.cancel,
    },
  });
  return result.isConfirmed;
}

interface PromptTextareaOptions {
  title: string;
  label: string;
  placeholder?: string;
  confirmText: string;
  cancelText?: string;
  danger?: boolean;
}

/** Two-button dialog with a required textarea (rejection reasons, ban reasons, etc). Resolves the entered text, or undefined if cancelled. */
export async function promptTextarea({
  title,
  label,
  placeholder,
  confirmText,
  cancelText = "Cancel",
  danger = false,
}: PromptTextareaOptions): Promise<string | undefined> {
  const { value, isConfirmed } = await Swal.fire({
    title,
    input: "textarea",
    inputLabel: label,
    inputPlaceholder: placeholder,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    buttonsStyling: false,
    customClass: {
      popup: swalClasses.popup,
      title: swalClasses.title,
      inputLabel: swalClasses.inputLabel,
      input: swalClasses.input,
      actions: swalClasses.actions,
      confirmButton: danger ? swalClasses.confirmDanger : swalClasses.confirmPrimary,
      cancelButton: swalClasses.cancel,
    },
    inputValidator: (v) => (!v ? "This field is required" : undefined),
  });
  return isConfirmed ? value : undefined;
}

const RECHARGE_AMOUNTS = [10, 20, 30, 50, 100];

/** AI-message recharge picker — shared by every entry point (AI chat, patient dashboard, quota banner). */
export async function showAiRechargeDialog(
  rechargeAiQuota: (amount: number) => Promise<{ paymentUrl?: string }>
): Promise<void> {
  const result = await Swal.fire({
    title: "Recharge AI Messages",
    html: `
      <p class="text-sm text-on-surface-variant mb-3">Select the amount of credits you'd like to purchase:</p>
      <select id="swal-recharge-amount" class="${swalClasses.input} !min-h-0 cursor-pointer">
        ${RECHARGE_AMOUNTS.map((amount) => `<option value="${amount}">${amount.toFixed(2)} EGP (${amount * 2} Messages)</option>`).join("")}
      </select>
    `,
    showCancelButton: true,
    confirmButtonText: "Recharge via Wallet",
    cancelButtonText: "Cancel",
    buttonsStyling: false,
    customClass: {
      popup: swalClasses.popup,
      title: swalClasses.title,
      htmlContainer: swalClasses.htmlContainer,
      actions: swalClasses.actions,
      confirmButton: swalClasses.confirmPrimary,
      cancelButton: swalClasses.cancel,
    },
    preConfirm: () => {
      const select = document.getElementById("swal-recharge-amount") as HTMLSelectElement;
      return Number(select?.value || RECHARGE_AMOUNTS[0]);
    },
  });

  if (!result.isConfirmed || !result.value) return;

  try {
    const res = await rechargeAiQuota(result.value);
    if (res.paymentUrl) {
      window.location.href = res.paymentUrl;
    }
  } catch (err) {
    console.error(err);
    showErrorAlert({ text: "Failed to initiate recharge. Please try again." });
  }
}

export default Swal;
