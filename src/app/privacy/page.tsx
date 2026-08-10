import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
export const metadata: Metadata = { title: "Политика обработки персональных данных" };
export default function PrivacyPage() {
  return (
    <PageIntro eyebrow="Документы" title="Политика обработки персональных данных">
      Политика обработки персональных данных будет опубликована до запуска онлайн-бронирования.
    </PageIntro>
  );
}
