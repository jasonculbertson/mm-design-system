"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, ArrowLeftRight, Send, Download, Settings, User, 
  Wallet, ShoppingCart, Link2, Shield, ChevronRight, Play
} from "lucide-react";
import { useColors } from "@/lib/components";
import { colors, spacing, radius, typography } from "@/lib/tokens";

interface FlowStep {
  id: string;
  name: string;
  screenId: string;
  description: string;
}

interface Flow {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  steps: FlowStep[];
}

const flows: Flow[] = [
  {
    id: "send",
    name: "Send Flow",
    description: "Complete flow for sending tokens to another address",
    icon: <Send size={24} />,
    color: "#8B99FF",
    steps: [
      { id: "send-1", name: "Select Asset", screenId: "wallet-home", description: "User selects the token they want to send from their wallet" },
      { id: "send-2", name: "Enter Amount", screenId: "send-amount", description: "User enters the amount to send with fiat conversion" },
      { id: "send-3", name: "Select Recipient", screenId: "send-recipient", description: "User enters or selects the recipient address" },
      { id: "send-4", name: "Review & Confirm", screenId: "send-confirm", description: "User reviews transaction details and gas fees" },
      { id: "send-5", name: "Processing", screenId: "pending", description: "Transaction is submitted and being processed" },
      { id: "send-6", name: "Success/Failure", screenId: "success", description: "User sees confirmation or error state" },
    ],
  },
  {
    id: "receive",
    name: "Receive Flow",
    description: "Flow for receiving tokens via QR code or address sharing",
    icon: <Download size={24} />,
    color: "#4AE39E",
    steps: [
      { id: "receive-1", name: "Open Receive", screenId: "wallet-home", description: "User taps receive button from wallet home" },
      { id: "receive-2", name: "Show QR", screenId: "receive", description: "Display QR code and address for sharing" },
      { id: "receive-3", name: "Share Address", screenId: "receive", description: "User can copy or share their address" },
    ],
  },
  {
    id: "swap",
    name: "Swap Flow",
    description: "Token swap flow with preview and confirmation",
    icon: <ArrowLeftRight size={24} />,
    color: "#FF7584",
    steps: [
      { id: "swap-1", name: "Select Tokens", screenId: "swap", description: "User selects tokens to swap" },
      { id: "swap-2", name: "Enter Amount", screenId: "swap", description: "User enters amount and sees conversion rate" },
      { id: "swap-3", name: "Review Swap", screenId: "send-confirm", description: "User reviews swap details and fees" },
      { id: "swap-4", name: "Processing", screenId: "pending", description: "Swap transaction is processing" },
      { id: "swap-5", name: "Complete", screenId: "success", description: "Swap completed successfully" },
    ],
  },
  {
    id: "connect-dapp",
    name: "dApp Connection",
    description: "Flow for connecting to a decentralized application",
    icon: <Link2 size={24} />,
    color: "#FFD33D",
    steps: [
      { id: "dapp-1", name: "Connection Request", screenId: "dapp-connect", description: "dApp requests wallet connection" },
      { id: "dapp-2", name: "Review Permissions", screenId: "dapp-connect", description: "User reviews requested permissions" },
      { id: "dapp-3", name: "Approve/Reject", screenId: "dapp-connect", description: "User approves or rejects connection" },
      { id: "dapp-4", name: "Connected", screenId: "wallet-home", description: "User returns to app with active connection" },
    ],
  },
  {
    id: "onboarding",
    name: "Onboarding Flow",
    description: "New user wallet creation and setup",
    icon: <User size={24} />,
    color: "#8B99FF",
    steps: [
      { id: "onboard-1", name: "Welcome", screenId: "onboarding-welcome", description: "Introduction and wallet creation options" },
      { id: "onboard-2", name: "Create Password", screenId: "onboarding-secure", description: "Set up a secure password" },
      { id: "onboard-3", name: "Backup Prompt", screenId: "onboarding-secure", description: "Explain importance of backup" },
      { id: "onboard-4", name: "Recovery Phrase", screenId: "onboarding-secure", description: "Show and verify recovery phrase" },
      { id: "onboard-5", name: "Complete", screenId: "success", description: "Wallet created successfully" },
    ],
  },
  {
    id: "security-setup",
    name: "Security Setup",
    description: "Enable advanced security features",
    icon: <Shield size={24} />,
    color: "#4AE39E",
    steps: [
      { id: "security-1", name: "Security Settings", screenId: "settings", description: "Access security settings" },
      { id: "security-2", name: "Enable 2FA", screenId: "settings", description: "Set up two-factor authentication" },
      { id: "security-3", name: "Verify", screenId: "success", description: "Confirm security setup" },
    ],
  },
];

export default function FlowsPage() {
  const router = useRouter();
  const c = useColors();
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const selectedFlowData = selectedFlow ? flows.find(f => f.id === selectedFlow) : null;

  return (
    <div style={{ minHeight: "100vh", background: c.background.default, fontFamily: typography.fontFamily.sans }}>
      {/* Header */}
      <div style={{ 
        padding: `${spacing[6]}px ${spacing[8]}px`, 
        borderBottom: `1px solid ${c.border.muted}`,
        background: c.background.section,
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <h1 style={{ 
            fontSize: typography.fontSize["2xl"], 
            fontWeight: typography.fontWeight.bold, 
            color: c.text.default,
            margin: 0,
          }}>
            User Flows
          </h1>
          <p style={{ 
            fontSize: typography.fontSize.sm, 
            color: c.text.alternative, 
            marginTop: spacing[1],
            margin: `${spacing[1]}px 0 0 0`,
          }}>
            {flows.length} documented flows • Click to explore step-by-step
          </p>
        </div>
      </div>

      {/* Flow Grid */}
      <div style={{ padding: `${spacing[6]}px ${spacing[8]}px`, maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
          gap: spacing[4],
        }}>
          {flows.map(flow => (
            <div
              key={flow.id}
              onClick={() => {
                setSelectedFlow(flow.id);
                setCurrentStepIndex(0);
              }}
              style={{
                background: c.background.section,
                borderRadius: radius.xl,
                padding: spacing[5],
                cursor: "pointer",
                transition: "transform 150ms ease, box-shadow 150ms ease",
                border: `1px solid ${c.border.muted}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = flow.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = c.border.muted;
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: spacing[4] }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: radius.lg,
                  background: `${flow.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: flow.color,
                  flexShrink: 0,
                }}>
                  {flow.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: typography.fontSize.lg, 
                    fontWeight: typography.fontWeight.semibold, 
                    color: c.text.default,
                    margin: 0,
                  }}>
                    {flow.name}
                  </h3>
                  <p style={{ 
                    fontSize: typography.fontSize.sm, 
                    color: c.text.alternative, 
                    margin: `${spacing[1]}px 0 0 0`,
                    lineHeight: `${typography.lineHeight.sm}px`,
                  }}>
                    {flow.description}
                  </p>
                </div>
              </div>

              {/* Steps Preview */}
              <div style={{ marginTop: spacing[4], display: "flex", alignItems: "center", gap: spacing[2], flexWrap: "wrap" }}>
                {flow.steps.map((step, index) => (
                  <div key={step.id} style={{ display: "flex", alignItems: "center", gap: spacing[2] }}>
                    <span style={{
                      width: 24,
                      height: 24,
                      borderRadius: radius.full,
                      background: c.background.muted,
                      color: c.text.alternative,
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.medium,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {index + 1}
                    </span>
                    {index < flow.steps.length - 1 && (
                      <ArrowRight size={12} style={{ color: c.text.muted }} />
                    )}
                  </div>
                ))}
                <span style={{
                  fontSize: typography.fontSize.xs,
                  color: c.text.muted,
                  marginLeft: spacing[2],
                }}>
                  {flow.steps.length} steps
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flow Detail Modal */}
      {selectedFlowData && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            background: c.overlay.default,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: spacing[4],
          }}
          onClick={() => setSelectedFlow(null)}
        >
          <div 
            style={{
              background: c.background.section,
              borderRadius: radius["2xl"],
              maxWidth: 1000,
              width: "100%",
              maxHeight: "90vh",
              overflow: "hidden",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ 
              padding: `${spacing[5]}px ${spacing[6]}px`, 
              borderBottom: `1px solid ${c.border.muted}`,
              display: "flex",
              alignItems: "center",
              gap: spacing[4],
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: radius.lg,
                background: `${selectedFlowData.color}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: selectedFlowData.color,
              }}>
                {selectedFlowData.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ 
                  fontSize: typography.fontSize.xl, 
                  fontWeight: typography.fontWeight.bold, 
                  color: c.text.default,
                  margin: 0,
                }}>
                  {selectedFlowData.name}
                </h2>
                <p style={{ 
                  fontSize: typography.fontSize.sm, 
                  color: c.text.alternative, 
                  margin: `${spacing[1]}px 0 0 0`,
                }}>
                  {selectedFlowData.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedFlow(null)}
                style={{
                  background: c.background.muted,
                  border: "none",
                  color: c.text.alternative,
                  cursor: "pointer",
                  padding: spacing[2],
                  borderRadius: radius.lg,
                  fontSize: typography.fontSize.sm,
                }}
              >
                Close
              </button>
            </div>

            {/* Flow Steps */}
            <div style={{ padding: spacing[6] }}>
              {/* Step Progress */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                marginBottom: spacing[6],
                gap: spacing[2],
              }}>
                {selectedFlowData.steps.map((step, index) => (
                  <div key={step.id} style={{ display: "flex", alignItems: "center", gap: spacing[2] }}>
                    <button
                      onClick={() => setCurrentStepIndex(index)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: radius.full,
                        background: index === currentStepIndex 
                          ? selectedFlowData.color 
                          : index < currentStepIndex 
                            ? c.success.default 
                            : c.background.muted,
                        color: index <= currentStepIndex ? c.primary.inverse : c.text.muted,
                        border: "none",
                        cursor: "pointer",
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.semibold,
                        transition: "all 150ms ease",
                      }}
                    >
                      {index + 1}
                    </button>
                    {index < selectedFlowData.steps.length - 1 && (
                      <div style={{
                        width: 40,
                        height: 2,
                        background: index < currentStepIndex ? c.success.default : c.border.muted,
                        borderRadius: radius.full,
                      }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Current Step Detail */}
              <div style={{
                background: c.background.default,
                borderRadius: radius.xl,
                padding: spacing[6],
                textAlign: "center",
              }}>
                <h3 style={{ 
                  fontSize: typography.fontSize.xl, 
                  fontWeight: typography.fontWeight.semibold, 
                  color: c.text.default,
                  margin: 0,
                }}>
                  Step {currentStepIndex + 1}: {selectedFlowData.steps[currentStepIndex].name}
                </h3>
                <p style={{ 
                  fontSize: typography.fontSize.base, 
                  color: c.text.alternative, 
                  margin: `${spacing[2]}px 0 0 0`,
                  maxWidth: 500,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}>
                  {selectedFlowData.steps[currentStepIndex].description}
                </p>

                {/* Screen Reference */}
                <div style={{ marginTop: spacing[6] }}>
                  <span style={{
                    background: c.background.section,
                    color: c.text.alternative,
                    padding: `${spacing[2]}px ${spacing[3]}px`,
                    borderRadius: radius.lg,
                    fontSize: typography.fontSize.sm,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: spacing[2],
                  }}>
                    Screen: {selectedFlowData.steps[currentStepIndex].screenId}
                    <button
                      onClick={() => router.push(`/screens`)}
                      style={{
                        background: c.primary.default,
                        color: c.primary.inverse,
                        border: "none",
                        borderRadius: radius.sm,
                        padding: `${spacing[1]}px ${spacing[2]}px`,
                        fontSize: typography.fontSize.xs,
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginTop: spacing[6],
              }}>
                <button
                  onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                  disabled={currentStepIndex === 0}
                  style={{
                    background: currentStepIndex === 0 ? c.background.muted : c.background.subsection,
                    color: currentStepIndex === 0 ? c.text.muted : c.text.default,
                    border: "none",
                    borderRadius: radius.lg,
                    padding: `${spacing[3]}px ${spacing[4]}px`,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    cursor: currentStepIndex === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentStepIndex(Math.min(selectedFlowData.steps.length - 1, currentStepIndex + 1))}
                  disabled={currentStepIndex === selectedFlowData.steps.length - 1}
                  style={{
                    background: currentStepIndex === selectedFlowData.steps.length - 1 
                      ? c.background.muted 
                      : c.primary.default,
                    color: currentStepIndex === selectedFlowData.steps.length - 1 
                      ? c.text.muted 
                      : c.primary.inverse,
                    border: "none",
                    borderRadius: radius.lg,
                    padding: `${spacing[3]}px ${spacing[4]}px`,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    cursor: currentStepIndex === selectedFlowData.steps.length - 1 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: spacing[2],
                  }}
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

