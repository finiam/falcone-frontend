import { getFileData } from "@/content/getData";
import Link from "next/link";

type FileData = ReturnType<typeof getFileData>;

const ArrowIcon = ({ rotate }: { rotate?: boolean }) => (
  <svg
    width="29"
    height="19"
    viewBox="0 0 29 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      rotate: `${rotate ? "180deg" : "none"}`,
    }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M28.9998 9.9998C28.9998 10.265 28.8945 10.5194 28.7069 10.7069C28.5194 10.8944 28.2651 10.9998 27.9998 10.9998L4.41384 10.9998L10.7078 17.2918C10.8956 17.4796 11.0011 17.7342 11.0011 17.9998C11.0011 18.2653 10.8956 18.52 10.7078 18.7078C10.5201 18.8956 10.2654 19.0011 9.99983 19.0011C9.73428 19.0011 9.47961 18.8956 9.29183 18.7078L1.29183 10.7078C1.19871 10.6149 1.12482 10.5046 1.07441 10.3831C1.024 10.2616 0.998047 10.1313 0.998047 9.9998C0.998047 9.86826 1.024 9.73802 1.07441 9.61653C1.12482 9.49504 1.19871 9.38469 1.29183 9.2918L9.29183 1.2918C9.38481 1.19882 9.49519 1.12507 9.61667 1.07475C9.73815 1.02443 9.86835 0.998535 9.99983 0.998535C10.2654 0.998535 10.5201 1.10402 10.7078 1.2918C10.8956 1.47957 11.0011 1.73425 11.0011 1.9998C11.0011 2.26535 10.8956 2.52002 10.7078 2.7078L4.41383 8.9998L27.9998 8.9998C28.2651 8.9998 28.5194 9.10515 28.7069 9.29269C28.8945 9.48023 28.9998 9.73458 28.9998 9.9998Z"
      fill="#212121"
    />
  </svg>
);

export default function FooterNav({
  previousRoute,
  nextRoute,
}: {
  previousRoute: FileData | null;
  nextRoute?: FileData | null;
}) {
  return (
    <nav className="flex justify-between border-t border-[#BFC9CE] mt-24 py-6">
      {previousRoute && (
        <div>
          <span className="uppercase text-blue opacity-50 text-20 font-500 mb-3 block text-right pr-2">
            Back
          </span>
          <div className="flex justify-between items-center gap-20">
            <ArrowIcon />
            <Link
              href={`/${previousRoute.route}`}
              className="text-blue text-32 font-yeseva"
            >
              {previousRoute.data.title}
            </Link>
          </div>
        </div>
      )}
      {nextRoute?.route && (
        <div className="ml-auto">
          <span className="uppercase text-blue opacity-50 text-20 font-500 mb-3 block text-left pr-2">
            Next
          </span>
          <div className="flex justify-between items-center gap-20">
            <Link
              href={`/${nextRoute.route}`}
              className="text-blue text-32 font-yeseva"
            >
              {nextRoute.data.title}
            </Link>
            <ArrowIcon rotate />
          </div>
        </div>
      )}
    </nav>
  );
}
