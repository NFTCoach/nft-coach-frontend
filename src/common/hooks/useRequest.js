import { prodlog } from "common/utils/prodlog";
import { useState } from "react";
import { toast } from "react-toastify";

export const useRequest = (func, { errorMsg } = {}) => {
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
        setLoading(false);
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
