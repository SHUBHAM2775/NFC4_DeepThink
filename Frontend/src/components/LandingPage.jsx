import React from "react";
import { useTranslation } from "react-i18next";
import heroImage from "../assets/hero-image.jpg";

import Header from "../navbar/Header";
import {
  BellIcon,
  GlobeAltIcon,
  MicrophoneIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  BookOpenIcon,
  WrenchIcon,
  ClipboardDocumentIcon,
  BellAlertIcon,
  MapPinIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

// All relevant icons, black for those you want, as per your instruction
const icons = {
  emergency: <BellIcon className="w-10 h-10 text-black mx-auto" />,
  languages: <GlobeAltIcon className="w-10 h-10 text-black mx-auto" />,
  voice: <MicrophoneIcon className="w-10 h-10 text-black mx-auto" />,
  ai: <CpuChipIcon className="w-10 h-10 text-black mx-auto" />,
  risk: <ExclamationTriangleIcon className="w-10 h-10 text-pink-600 mx-auto" />,
  access: <TruckIcon className="w-10 h-10 text-pink-600 mx-auto" />,
  knowledge: <BookOpenIcon className="w-10 h-10 text-pink-600 mx-auto" />,
  supportTools: <WrenchIcon className="w-10 h-10 text-pink-600 mx-auto" />,
  log: <ClipboardDocumentIcon className="w-10 h-10 text-pink-600 mx-auto" />,
  reminders: <BellAlertIcon className="w-10 h-10 text-pink-600 mx-auto" />,
  labor: <MapPinIcon className="w-10 h-10 text-pink-600 mx-auto" />,
  asha: <UserIcon className="w-10 h-10 text-pink-600 mx-auto" />,
  family: <UsersIcon className="w-10 h-10 text-pink-600 mx-auto" />,
  language: <GlobeAltIcon className="w-10 h-10 text-pink-600 mx-auto" />,
  aiAssistant: <CpuChipIcon className="w-10 h-10 text-pink-600 mx-auto" />,
};

const features = [
  {
    icon: icons.log,
    titleKey: "landing.features.voiceBasedDailyLog.title",
    textKey: "landing.features.voiceBasedDailyLog.text",
  },
  {
    icon: icons.reminders,
    titleKey: "landing.features.automatedReminders.title",
    textKey: "landing.features.automatedReminders.text",
  },
  {
    icon: icons.labor,
    titleKey: "landing.features.emergencyLaborButton.title",
    textKey: "landing.features.emergencyLaborButton.text",
  },
  {
    icon: icons.asha,
    titleKey: "landing.features.ashaWorkerIntegration.title",
    textKey: "landing.features.ashaWorkerIntegration.text",
  },
  {
    icon: icons.family,
    titleKey: "landing.features.familyMemberAccess.title",
    textKey: "landing.features.familyMemberAccess.text",
  },
  {
    icon: icons.language,
    titleKey: "landing.features.multiLanguageSupport.title",
    textKey: "landing.features.multiLanguageSupport.text",
  },
  {
    icon: icons.aiAssistant,
    titleKey: "landing.features.aiHealthAssistants.title",
    textKey: "landing.features.aiHealthAssistants.text",
  },
];

const challenges = [
  {
    icon: icons.risk,
    titleKey: "landing.challenges.lifeThreateningRisks.title",
    textKey: "landing.challenges.lifeThreateningRisks.text",
  },
  {
    icon: icons.access,
    titleKey: "landing.challenges.limitedHealthcareAccess.title",
    textKey: "landing.challenges.limitedHealthcareAccess.text",
  },
  {
    icon: icons.knowledge,
    titleKey: "landing.challenges.knowledgeGap.title",
    textKey: "landing.challenges.knowledgeGap.text",
  },
  {
    icon: icons.supportTools,
    titleKey: "landing.challenges.inadequateSupportTools.title",
    textKey: "landing.challenges.inadequateSupportTools.text",
  },
];

const LandingPage = ({ onNavigateToLogin }) => {
  const { t } = useTranslation();
  return (
    <>
      <Header onLoginClick={onNavigateToLogin} />
      <div className="bg-white min-h-screen">
        {/* HERO SECTION */}
        <section className="flex justify-between items-center px-[8vw] py-14 pb-10 bg-white">
          <div className="max-w-[540px] text-gray-600">
            <div className="text-[18px] tracking-wide font-medium text-black">
              {t("landing.headerTagline")}
            </div>
            <h1 className="text-[44px] font-extrabold leading-tight mt-3 mb-6 text-gray-600">
              {t("landing.heroTitle")}{" "}
              <span className="text-pink-600">
                {t("landing.heroTitleHighlight1")}
              </span>{" "}
              <br />
              {t("landing.heroTitleWith")}{" "}
              <span className="text-pink-600">
                {t("landing.heroTitleHighlight2")}
              </span>
            </h1>
            <p className="text-[20px] mb-8">{t("landing.heroDescription")}</p>
            <div className="flex gap-4 mb-9">
              <button
                onClick={onNavigateToLogin}
                className="bg-pink-600 text-white font-semibold text-lg px-8 py-3 rounded-md cursor-pointer"
              >
                {t("landing.startTrackingButton")}
              </button>
              <button
                disabled
                className="bg-gray-200 text-gray-400 font-semibold text-lg px-8 py-3 rounded-md cursor-not-allowed"
              >
                {t("landing.learnMoreButton")}
              </button>
            </div>
            <div className="flex gap-9">
              <div className="text-center">
                <div className="text-black text-4xl">{icons.emergency}</div>
                <div className="mt-0.5 text-gray-600 text-base whitespace-pre-line">
                  {t("landing.emergencySupport")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-black text-4xl">{icons.languages}</div>
                <div className="mt-0.5 text-gray-600 text-base whitespace-pre-line">
                  {t("landing.localLanguages")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-black text-4xl">{icons.voice}</div>
                <div className="mt-0.5 text-gray-600 text-base whitespace-pre-line">
                  {t("landing.voiceInterface")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-black text-4xl">{icons.ai}</div>
                <div className="mt-0.5 text-gray-600 text-base whitespace-pre-line">
                  {t("landing.aiAssistant")}
                </div>
              </div>
            </div>
          </div>
          {/* Illustrative image */}
          <div className="relative">
            <img
              src={heroImage}
              alt="heroimage"
              className="rounded-xl w-[410px] h-[370px] object-cover shadow-[0_6px_26px_rgba(167,255,196,0.1)]"
            />
            {/* Overlays */}
            {/* <div className="absolute top-[20px] left-[18px] bg-white rounded-lg px-4 py-1.5 text-teal-700 font-semibold text-base inline-block">
              {t("landing.overlayDailyLog")}{" "}
              <span className="text-gray-400 font-normal">
                {t("landing.overlayDailyLogSubtext")}
              </span>
            </div>
            <div className="absolute top-[180px] right-[25px] bg-white rounded-lg px-4 py-1.5 text-pink-600 font-semibold text-base inline-block">
              {t("landing.overlayEmergencyAlert")}{" "}
              <span className="text-gray-400 font-normal">
                {t("landing.overlayEmergencyAlertSubtext")}
              </span>
            </div> */}
          </div>
        </section>

        {/* CHALLENGES SECTION */}
        <section className="bg-[#f7fafd] py-16">
          <div className="max-w-[84vw] mx-auto">
            <h2 className="text-center text-4xl font-extrabold text-gray-900">
              {t("landing.challengesTitle")}
            </h2>
            <p className="text-center text-gray-600 text-lg mt-3 max-w-[680px] mx-auto">
              {t("landing.challengesDescription")}
            </p>
            <div className="grid grid-cols-2 gap-6 mt-12 max-w-[900px] mx-auto">
              {challenges.map((c, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 shadow-md flex gap-4 items-start"
                >
                  <span className="text-pink-600 text-3xl flex-shrink-0">
                    {c.icon}
                  </span>
                  <div>
                    <h3 className="text-gray-600 font-semibold text-lg mb-1">
                      {t(c.titleKey)}
                    </h3>
                    <p className="text-gray-500 text-sm">{t(c.textKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOLUTION SECTION */}
        <section className="bg-[#f7fafd] py-9 text-center px-4">
          <h3 className="text-2xl font-extrabold text-pink-600 mb-2">
            {t("landing.solutionTitle")}
          </h3>
          <p className="max-w-[820px] mx-auto text-gray-600 text-lg">
            {t("landing.solutionDescription")}
          </p>
        </section>

        {/* FEATURES SECTION */}
        <section className="bg-white py-14">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {t("landing.featuresTitle")}
          </h2>
          <p className="text-center text-gray-600 text-lg mt-3 max-w-[760px] mx-auto">
            {t("landing.featuresDescription")}
          </p>
          <div className="grid grid-cols-3 gap-7 max-w-[1160px] mx-auto mt-12 px-4">
            {features.map((f, idx) => (
              <div key={idx} className="bg-[#f7fafd] rounded-xl p-6 shadow-md">
                <div className="text-pink-600 text-3xl mb-3">{f.icon}</div>
                <h4 className="text-gray-600 font-semibold text-lg mb-2">
                  {t(f.titleKey)}
                </h4>
                <p className="text-gray-500 text-sm">{t(f.textKey)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#f7fafd] text-gray-600 font-medium py-7 text-center border-t border-gray-200">
          {t("landing.footerText", { year: new Date().getFullYear() })}
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
