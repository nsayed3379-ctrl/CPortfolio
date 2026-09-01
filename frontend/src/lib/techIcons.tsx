import type { ComponentType, SVGProps } from "react";
import {
  SiDigitalocean,
  SiDjango,
  SiDocker,
  SiFastapi,
  SiFigma,
  SiFlutter,
  SiKotlin,
  SiKubernetes,
  SiLaravel,
  SiNextdotjs,
  SiNodedotjs,
  SiPytorch,
  SiPython,
  SiReact,
  SiScikitlearn,
  SiSpringboot,
  SiSwift,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
// AWS has no mark in Simple Icons (Amazon had it pulled for trademark
// reasons), so that one badge borrows Font Awesome's logo instead.
import { FaAws } from "react-icons/fa6";
import { Frame, LayoutGrid, Layers, Network, Palette } from "lucide-react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

// Brand hex per item — used to tint the icon and the hover glow so each
// badge reads as "that technology's color", not one flat accent everywhere.
// Concepts without an official mark (REST APIs, NLP, ...) fall back to a
// generic lucide icon in one of the site's own accent colors.
export const TECH_ICONS: Record<string, { Icon: IconComponent; color: string }> = {
  "Next.js": { Icon: SiNextdotjs, color: "#000000" },
  "React": { Icon: SiReact, color: "#61DAFB" },
  "TypeScript": { Icon: SiTypescript, color: "#3178C6" },
  "Tailwind CSS": { Icon: SiTailwindcss, color: "#06B6D4" },

  "Node.js": { Icon: SiNodedotjs, color: "#339933" },
  "Django": { Icon: SiDjango, color: "#092E20" },
  "FastAPI": { Icon: SiFastapi, color: "#009688" },
  "REST APIs": { Icon: Network, color: "#2e5eff" },
  "Spring Boot": { Icon: SiSpringboot, color: "#6DB33F" },
  "PHP Laravel": { Icon: SiLaravel, color: "#FF2D20" },

  "Python": { Icon: SiPython, color: "#3776AB" },
  "PyTorch": { Icon: SiPytorch, color: "#EE4C2C" },
  "scikit-learn Machine Learning": { Icon: SiScikitlearn, color: "#F7931E" },
  "Natural Language Processing": { Icon: Layers, color: "#0891b2" },
  "Deep Learning": { Icon: Layers, color: "#3f6bff" },

  "React Native": { Icon: SiReact, color: "#61DAFB" },
  "Flutter": { Icon: SiFlutter, color: "#02569B" },
  "Swift": { Icon: SiSwift, color: "#F05138" },
  "Kotlin": { Icon: SiKotlin, color: "#7F52FF" },

  "Docker": { Icon: SiDocker, color: "#2496ED" },
  "AWS": { Icon: FaAws, color: "#FF9900" },
  "DigitalOcean": { Icon: SiDigitalocean, color: "#0080FF" },
  "Kubernetes": { Icon: SiKubernetes, color: "#326CE5" },

  "Figma": { Icon: SiFigma, color: "#F24E1E" },
  "UI/UX Design": { Icon: Palette, color: "#2e5eff" },
  "Design Systems": { Icon: LayoutGrid, color: "#0891b2" },
  "Prototyping": { Icon: Frame, color: "#3f6bff" },
};

export function getTechIcon(item: string) {
  return TECH_ICONS[item] ?? { Icon: Network, color: "#2e5eff" };
}

export function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
