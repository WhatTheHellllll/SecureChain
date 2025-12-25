import { ref } from "vue";
import { showSuccess, showError, confirmDelete } from "../utils/alert.js";

/**
 * Custom hook for standard Create, Read, Update, Delete logic
 * @param {Object} options - { serviceFn, successMsg, confirmMsg }
 */
export function useCrud() {
  const isPending = ref(false);

  /**
   * Wrapper for any API action (Create, Update, or Delete)
   */
  const executeAction = async (apiCall, successMessage = null) => {
    isPending.value = true;
    try {
      const response = await apiCall();

      //  Only show success message if one is provided (prevents empty popups)
      if (successMessage) {
        showSuccess(successMessage);
      }

      // Check if 'response' exists before trying to read '.data'
      // This allows void functions (like fetchData) to work without crashing
      return {
        success: true,
        data: response ? response.data : null,
      };
    } catch (err) {
      console.error("FULL ERROR DETAILS:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Action failed";
      showError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      isPending.value = false;
    }
  };
  /**
   * Specialized wrapper for Deletion with confirmation
   */
  const confirmAndRemove = async (apiCall, itemName) => {
    const confirmed = await confirmDelete(
      `Are you sure you want to remove ${itemName}?`
    );
    if (confirmed) {
      return await executeAction(apiCall, `${itemName} removed successfully`);
    }
    return { success: false, cancelled: true };
  };

  return { isPending, executeAction, confirmAndRemove };
}
