/**
 * MetaMask Icon Component
 * 
 * Uses the official MetaMask SVG icons copied from @metamask/design-system-react-native
 * Stored locally in assets/icons/ for reliable bundling.
 */
import React from "react";
import { View } from "react-native";
import { useComponentColors } from "../../lib/ComponentTheme";

// Import icons from local assets folder (copied from MM package)
import WalletSVG from "../../assets/icons/wallet.svg";
import SendSVG from "../../assets/icons/send.svg";
import ReceiveSVG from "../../assets/icons/receive.svg";
import SwapHorizontalSVG from "../../assets/icons/swap-horizontal.svg";
import SwapVerticalSVG from "../../assets/icons/swap-vertical.svg";
import GasSVG from "../../assets/icons/gas.svg";
import BridgeSVG from "../../assets/icons/bridge.svg";
import StakeSVG from "../../assets/icons/stake.svg";
import BankSVG from "../../assets/icons/bank.svg";
import CardSVG from "../../assets/icons/card.svg";
import MoneySVG from "../../assets/icons/money.svg";
import CoinSVG from "../../assets/icons/coin.svg";
import BuySellSVG from "../../assets/icons/buy-sell.svg";
import HomeSVG from "../../assets/icons/home.svg";
import HomeFilledSVG from "../../assets/icons/home-filled.svg";
import MenuSVG from "../../assets/icons/menu.svg";
import ArrowLeftSVG from "../../assets/icons/arrow-left.svg";
import ArrowRightSVG from "../../assets/icons/arrow-right.svg";
import ArrowUpSVG from "../../assets/icons/arrow-up.svg";
import ArrowDownSVG from "../../assets/icons/arrow-down.svg";
import AddSVG from "../../assets/icons/add.svg";
import AddCircleSVG from "../../assets/icons/add-circle.svg";
import CloseSVG from "../../assets/icons/close.svg";
import CheckSVG from "../../assets/icons/check.svg";
import CheckBoldSVG from "../../assets/icons/check-bold.svg";
import CopySVG from "../../assets/icons/copy.svg";
import CopySuccessSVG from "../../assets/icons/copy-success.svg";
import EditSVG from "../../assets/icons/edit.svg";
import TrashSVG from "../../assets/icons/trash.svg";
import RefreshSVG from "../../assets/icons/refresh.svg";
import SearchSVG from "../../assets/icons/search.svg";
import FilterSVG from "../../assets/icons/filter.svg";
import DownloadSVG from "../../assets/icons/download.svg";
import UploadSVG from "../../assets/icons/upload.svg";
import ShareSVG from "../../assets/icons/share.svg";
import LinkSVG from "../../assets/icons/link.svg";
import ScanSVG from "../../assets/icons/scan.svg";
import QrCodeSVG from "../../assets/icons/qr-code.svg";
import LockSVG from "../../assets/icons/lock.svg";
import LockSlashSVG from "../../assets/icons/lock-slash.svg";
import KeySVG from "../../assets/icons/key.svg";
import SecurityKeySVG from "../../assets/icons/security-key.svg";
import SecuritySVG from "../../assets/icons/security.svg";
import ShieldLockSVG from "../../assets/icons/shield-lock.svg";
import EyeSVG from "../../assets/icons/eye.svg";
import EyeSlashSVG from "../../assets/icons/eye-slash.svg";
import FingerprintSVG from "../../assets/icons/fingerprint.svg";
import FaceIdSVG from "../../assets/icons/face-id.svg";
import InfoSVG from "../../assets/icons/info.svg";
import QuestionSVG from "../../assets/icons/question.svg";
import WarningSVG from "../../assets/icons/warning.svg";
import DangerSVG from "../../assets/icons/danger.svg";
import ErrorSVG from "../../assets/icons/error.svg";
import ConfirmationSVG from "../../assets/icons/confirmation.svg";
import ClockSVG from "../../assets/icons/clock.svg";
import PendingSVG from "../../assets/icons/pending.svg";
import HeartSVG from "../../assets/icons/heart.svg";
import HeartFilledSVG from "../../assets/icons/heart-filled.svg";
import StarSVG from "../../assets/icons/star.svg";
import StarFilledSVG from "../../assets/icons/star-filled.svg";
import UserSVG from "../../assets/icons/user.svg";
import UserCircleSVG from "../../assets/icons/user-circle.svg";
import PeopleSVG from "../../assets/icons/people.svg";
import NotificationSVG from "../../assets/icons/notification.svg";
import SettingSVG from "../../assets/icons/setting.svg";
import SettingFilledSVG from "../../assets/icons/setting-filled.svg";
import GlobalSVG from "../../assets/icons/global.svg";
import EthereumSVG from "../../assets/icons/ethereum.svg";
import SnapsSVG from "../../assets/icons/snaps.svg";
import FlaskSVG from "../../assets/icons/flask.svg";
import ConnectSVG from "../../assets/icons/connect.svg";
import MoreVerticalSVG from "../../assets/icons/more-vertical.svg";
import MoreHorizontalSVG from "../../assets/icons/more-horizontal.svg";
import ExpandSVG from "../../assets/icons/expand.svg";
import CollapseSVG from "../../assets/icons/collapse.svg";
import ActivitySVG from "../../assets/icons/activity.svg";
import CameraSVG from "../../assets/icons/camera.svg";

// Map icon names to SVG components
const iconMap: Record<string, React.FC<any>> = {
  // Wallet & Finance
  Wallet: WalletSVG,
  Send: SendSVG,
  Receive: ReceiveSVG,
  SwapHorizontal: SwapHorizontalSVG,
  SwapVertical: SwapVerticalSVG,
  Gas: GasSVG,
  Bridge: BridgeSVG,
  Stake: StakeSVG,
  Bank: BankSVG,
  Card: CardSVG,
  Money: MoneySVG,
  Coin: CoinSVG,
  BuySell: BuySellSVG,
  
  // Navigation
  Home: HomeSVG,
  HomeFilled: HomeFilledSVG,
  Menu: MenuSVG,
  ArrowLeft: ArrowLeftSVG,
  ArrowRight: ArrowRightSVG,
  ArrowUp: ArrowUpSVG,
  ArrowDown: ArrowDownSVG,
  Expand: ExpandSVG,
  Collapse: CollapseSVG,
  
  // Actions
  Add: AddSVG,
  AddCircle: AddCircleSVG,
  Close: CloseSVG,
  Check: CheckSVG,
  CheckBold: CheckBoldSVG,
  Copy: CopySVG,
  CopySuccess: CopySuccessSVG,
  Edit: EditSVG,
  Trash: TrashSVG,
  Refresh: RefreshSVG,
  Search: SearchSVG,
  Filter: FilterSVG,
  Download: DownloadSVG,
  Upload: UploadSVG,
  Share: ShareSVG,
  Link: LinkSVG,
  Scan: ScanSVG,
  QrCode: QrCodeSVG,
  MoreVertical: MoreVerticalSVG,
  MoreHorizontal: MoreHorizontalSVG,
  Activity: ActivitySVG,
  Camera: CameraSVG,
  
  // Security
  Lock: LockSVG,
  LockSlash: LockSlashSVG,
  Key: KeySVG,
  SecurityKey: SecurityKeySVG,
  Security: SecuritySVG,
  ShieldLock: ShieldLockSVG,
  Eye: EyeSVG,
  EyeSlash: EyeSlashSVG,
  Fingerprint: FingerprintSVG,
  FaceId: FaceIdSVG,
  
  // Status
  Info: InfoSVG,
  Question: QuestionSVG,
  Warning: WarningSVG,
  Danger: DangerSVG,
  Error: ErrorSVG,
  Confirmation: ConfirmationSVG,
  Clock: ClockSVG,
  Pending: PendingSVG,
  
  // Social
  Heart: HeartSVG,
  HeartFilled: HeartFilledSVG,
  Star: StarSVG,
  StarFilled: StarFilledSVG,
  User: UserSVG,
  UserCircle: UserCircleSVG,
  People: PeopleSVG,
  Notification: NotificationSVG,
  
  // System
  Setting: SettingSVG,
  SettingFilled: SettingFilledSVG,
  Global: GlobalSVG,
  
  // Crypto
  Ethereum: EthereumSVG,
  Snaps: SnapsSVG,
  Flask: FlaskSVG,
  Connect: ConnectSVG,
};

export const ICON_NAMES = Object.keys(iconMap);

// Size mapping
const sizeMap = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
};

export interface MMIconProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "default" | "alternative" | "muted" | "primary" | "error" | "success" | "warning";
}

export function MMIcon({ 
  name, 
  size = "md", 
  color = "default" 
}: MMIconProps) {
  const themeColors = useComponentColors();
  
  const SvgComponent = iconMap[name];
  const sizeValue = sizeMap[size];
  
  // Get color from theme
  const getColor = () => {
    switch (color) {
      case "default": return themeColors.icon.default;
      case "alternative": return themeColors.icon.alternative;
      case "muted": return themeColors.icon.muted;
      case "primary": return themeColors.primary.default;
      case "error": return themeColors.error.default;
      case "success": return themeColors.success.default;
      case "warning": return themeColors.warning.default;
      default: return themeColors.icon.default;
    }
  };
  
  if (!SvgComponent) {
    console.warn(`MMIcon: Unknown icon name "${name}"`);
    return (
      <View style={{ 
        width: sizeValue, 
        height: sizeValue, 
        backgroundColor: themeColors.error.muted, 
        borderRadius: sizeValue / 2 
      }} />
    );
  }
  
  return (
    <SvgComponent
      width={sizeValue}
      height={sizeValue}
      fill={getColor()}
    />
  );
}

export default MMIcon;
