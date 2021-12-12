import { prodlog } from "common/utils/prodlog";
import { useState } from "react";
import { toast } from "react-toastify";



export const useEventRequest = (func, { eventName, contract, errorMsg, onFinished } = {}) => {
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
        const res = await func?.(...args);
        const _fn = new Promise((resolve, reject) => {
            contract.on(eventName, (...arguments) => {
                onFinished?.();
                setLoading(false);
                resolve(...arguments);
            });
        });
        setTimeout(_fn, 30 * 1000);
        return res;
      } catch (err) {
        prodlog(err);
        notify(errorMsg);
        setLoading(false);
      }
    },
    loading: loading,
  };

  return fn;
};
