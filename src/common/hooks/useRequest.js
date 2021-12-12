import { prodlog } from "common/utils/prodlog";
import { useState } from "react";
import { toast } from "react-toastify";

export const useRequest = (
  func,
  { errorMsg, onStart, onFinished } = {},
  { timeout, message } = {}
) => {
  const [loading, setLoading] = useState(false);

  const notify = (msg) =>
    toast(msg || "Something went wrong", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: false,
    });

  const fn = {
    exec: async function (...args) {
      try {
        setLoading(true);
        onStart?.();
        if (timeout) {
          setTimeout(() => {
            toast(message, {
              autoClose: timeout,
            });
          }, timeout);
        }
        const res = await func?.(...args);
        setLoading(false);
        onFinished?.();
        return res;
      } catch (err) {
        prodlog(err);
        notify(errorMsg);
        setLoading(false);
        throw new Error(err);
      }
    },
    loading: loading,
  };

  return fn;
};
