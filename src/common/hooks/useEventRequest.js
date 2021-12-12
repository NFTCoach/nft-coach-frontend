import { useState } from "react";
import { toast } from "react-toastify";

export const useEventRequest = (
  promise,
  { eventName, contract, errorMsg, onFinished, onStart, onListeningEvent } = {}
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
      setLoading(true);
      let timer;
      return new Promise((res, rej) => {
        const func = async () => {
          await promise?.(...args);
        };
        func(res, rej)
          .then(() => {
            onStart?.();
            onListeningEvent?.();
            contract.on(eventName, (...args) => {
              setLoading(false);
              res(...args);
              onFinished?.();
            });

            timer = setTimeout(() => {
              rej("Timeout exceeded");
              notify(errorMsg);
              setLoading(false);
            }, 60 * 1000);
          })
          .catch((err) => {
            setLoading(false);
            clearTimeout(timer);
            rej(err);
          });
      });
    },
    loading: loading,
  };

  return fn;
};
