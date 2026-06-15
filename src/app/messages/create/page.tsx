import { createChat } from "./actions";

export default async function CreateMessagePage({ searchParams: searchParamsPromise }: { searchParams: Promise<{ adId: string }> }) {
    const searchParams = await searchParamsPromise;
    // Эта страница просто обрабатывает POST запрос через серверное действие
    // Но для корректной работы Next.js нам нужен дефолтный экспорт или форма
    return (
        <div className="flex items-center justify-center min-h-screen">
            <form action={createChat}>
                <input type="hidden" name="adId" value={searchParams.adId} />
                <button type="submit" className="bg-[#00aa61] text-white px-8 py-4 rounded-lg font-bold">
                    Подтвердить отклик
                </button>
            </form>
        </div>
    );
}
