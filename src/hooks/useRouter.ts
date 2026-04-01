import { useRouter as useExpoRouter, useSegments as useExpoSegments } from 'expo-router';

export function useRouter() {
  const router = useExpoRouter();
  return {
    push: (href: string) => router.push(href as any),
    replace: (href: string) => router.replace(href as any),
    back: () => router.back(),
    canGoBack: () => router.canGoBack(),
  };
}

export function useSegments() {
  return useExpoSegments() as string[];
}
