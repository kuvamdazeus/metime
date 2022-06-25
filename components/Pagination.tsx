import { useRecoilValue } from "recoil";
import { dashboardAtom } from "../state/dashboard";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import useRecomData from "../utils/hooks/useRecomData";

export default function Pagination() {
  const { saveRecommendations } = useRecomData();

  const dashboardData = useRecoilValue(dashboardAtom);

  if (dashboardData)
    return (
      <div className="flex items-center bg-[#323232] rounded-full p-1">
        <MdKeyboardArrowLeft
          onClick={() => dashboardData.current_batch > 0 && saveRecommendations(dashboardData.current_batch - 1)}
          className="mr-3 text-2xl cursor-pointer"
        />
        <p className="font-light text-sm">
          <span className="font-bold">{dashboardData.current_batch + 1}</span>{" "}
          <span className="font-extralight">OF</span> <span className="font-bold">10</span>
        </p>
        <MdKeyboardArrowRight
          onClick={() => dashboardData.current_batch < 10 && saveRecommendations(dashboardData.current_batch + 1)}
          className="ml-3 text-2xl cursor-pointer"
        />
      </div>
    );
  else return <></>;
}
