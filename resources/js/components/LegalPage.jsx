export default function LegalPage({ kicker, title, intro, children }) {
    return (
        <main>
            <section className="bg-pine px-4 py-16 text-white sm:px-6 md:py-20">
                <div className="mx-auto max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wood">
                        {kicker}
                    </p>
                    <h1 className="mt-3 text-4xl font-bold md:text-5xl">
                        {title}
                    </h1>
                    {intro && (
                        <p className="mt-4 text-lg leading-8 text-white/80">
                            {intro}
                        </p>
                    )}
                </div>
            </section>
            <section className="px-4 py-12 sm:px-6 md:py-16">
                <div className="mx-auto max-w-3xl space-y-6 text-[15px] leading-7 text-stone-700">
                    {children}
                </div>
            </section>
        </main>
    );
}
