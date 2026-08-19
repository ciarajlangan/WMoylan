"use client";

import { useRouter } from "next/navigation";

export default function Home() {

    const router = useRouter();

    return (
        <main className="landing-container">

            <section className="landing-card">

                <h1>Waterman-Moylan</h1>

                <h2>IT Support Ticketing System</h2>

                <p>
                    Report IT issues, manage support tickets and track
                    requests through the ticketing system.
                </p>

                <button
                    className="submit-button"
                    onClick={() => router.push("/login")}
                >
                    Sign In
                </button>

                <button
                    className="secondary-button"
                    onClick={() => router.push("/register")}
                >
                    Create Account
                </button>

            </section>

        </main>
    );
}