import { useEffect, useState } from "react";

function checkPasswordStrength(password: string) {
  let strength = 1;

  // Check length of the password
  if (password.length >= 8) {
    strength += 1;
  }

  // Check if password contains numbers, lowercase and uppercase letters, and special characters
  if (/[0-9]/.test(password)) {
    strength += 1;
  }
  if (/[a-z]/.test(password)) {
    strength += 1;
  }
  if (/[A-Z]/.test(password)) {
    strength += 1;
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    strength += 1;
  }

  // Return the strength value
  return strength;
}

export const usePasswordStrength = (password: string) => {
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (password.length > 8) {
            setScore(checkPasswordStrength(password));
            // zxcvbnAsync(password).then((response) => setScore(response?.score));
        } else {
            setScore(1);
        }
    }, [password]);

    return score;
};
