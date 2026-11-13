const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export type PasswordStrengthLevel = "fraca" | "comum" | "boa" | "excelente";

export type PasswordRequirement = {
  label: string;
  met: boolean;
};

export type PasswordStrength = {
  level: PasswordStrengthLevel;
  label: string;
  /** Força em uma escala de 1 (Fraca) a 4 (Excelente). */
  score: 1 | 2 | 3 | 4;
  /** Todos os requisitos obrigatórios foram atendidos. */
  isStrong: boolean;
  requirements: PasswordRequirement[];
};

const LEVEL_LABELS: Record<PasswordStrengthLevel, string> = {
  fraca: "Fraca",
  comum: "Comum",
  boa: "Bom",
  excelente: "Excelente",
};

export function getPasswordStrength(password: string): PasswordStrength {
  const requirements: PasswordRequirement[] = [
    { label: "Pelo menos 8 caracteres", met: password.length >= 8 },
    { label: "1 letra maiúscula", met: /[A-Z]/.test(password) },
    { label: "Pelo menos um número", met: /\d/.test(password) },
  ];

  const isStrong = requirements.every((requirement) => requirement.met);

  let score: PasswordStrength["score"] = 1;
  if (isStrong) {
    const extras = [
      password.length >= 12,
      /[a-z]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;

    score = extras === 0 ? 2 : extras === 1 ? 3 : 4;
  }

  const level: PasswordStrengthLevel =
    score === 1 ? "fraca" : score === 2 ? "comum" : score === 3 ? "boa" : "excelente";

  return { level, label: LEVEL_LABELS[level], score, isStrong, requirements };
}
