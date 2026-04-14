import { AiFillThunderbolt } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import {
  FaAngleRight,
  FaExpandArrowsAlt,
  FaLink,
  FaPowerOff,
} from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import {
  IoMdArrowDropdown,
  IoMdArrowDropleft,
  IoMdArrowDropright,
  IoMdArrowDropup,
} from "react-icons/io";
import { IoTriangle } from "react-icons/io5";
import { LuMousePointerClick } from "react-icons/lu";
import { PiFlipVerticalFill, PiSlidersHorizontalFill } from "react-icons/pi";
import { RiLoopRightLine, RiPlayLargeFill, RiStairsLine } from "react-icons/ri";
import { RxDash } from "react-icons/rx";
import { TbEaseInOut, TbSteeringWheelFilled } from "react-icons/tb";
import { VscLink } from "react-icons/vsc";

export const Icons = {
  Link: FaLink,
  Thunder: AiFillThunderbolt,
  ArrowDropLeft: IoMdArrowDropleft,
  ArrowDropRight: IoMdArrowDropright,
  ArrowDropUp: IoMdArrowDropup,
  ArrowDropDown: IoMdArrowDropdown,
  Fullscreen: FaExpandArrowsAlt,
  Link2: VscLink,
  SteeringWheel: TbSteeringWheelFilled,
  Triangle: IoTriangle,
  FlipVertical: PiFlipVerticalFill,
  Stairs: RiStairsLine,
  EaseInOut: TbEaseInOut,
  Sliders: PiSlidersHorizontalFill,
  DotFill: GoDotFill,
  AngleRight: FaAngleRight,
  Dash: RxDash,
  Loop: RiLoopRightLine,
  Play: RiPlayLargeFill,
  ArrowRight: BsArrowRight,
  MousePointerClick: LuMousePointerClick,
  Power: FaPowerOff,
} as const;

export type IconName = keyof typeof Icons;
export type IconType = (typeof Icons)[IconName];
