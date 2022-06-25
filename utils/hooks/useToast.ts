import { useRecoilState } from "recoil";
import toastAtom from "../../state/toast";
import { IToast } from "../../types/toast";

export default function useToast() {
  const [toast, setToast] = useRecoilState(toastAtom);

  const toggleToast = (toastData: IToast) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  return toggleToast;
}
