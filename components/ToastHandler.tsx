import { useRecoilValue } from "recoil";
import toastAtom from "../state/toast";

export default function ToastHandler() {
  const toast = useRecoilValue(toastAtom);

  if (toast)
    return (
      <section className="transition-all ease-in-out w-full flex justify-center fixed bottom-32">
        <div className={`text-center rounded px-7 py-3 ${toast.type === "error" ? "bg-red-500" : "bg-blue-600"}`}>
          <p className="font-light text-white">{toast.message}</p>
        </div>
      </section>
    );

  return <></>;
}
