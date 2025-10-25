import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Logo = () => {
  const { t } = useTranslation();

  return (
    <Link to={"/"} className="flex text-white items-center space-x-2">
      <div className="text-3xl font-spaceGrotesk font-bold ">TeamSoft </div>
      <div className="text-3xl font-spaceGrotesk font-bold">
        {t("welcomeCRM")}
      </div>
    </Link>
  );
};

export default Logo;
