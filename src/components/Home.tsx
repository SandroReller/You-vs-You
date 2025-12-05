import { Flame, Target, Trophy, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const quotes = [
  "Der einzige Weg, großartige Arbeit zu leisten, ist zu lieben, was man tut. - Steve Jobs",
  "Du bist nicht dein Fehler, du bist deine Versuche. - Unbekannt",
  "Erfolg ist die Summe kleiner Bemühungen, die Tag für Tag wiederholt werden. - Robert Collier",
  "Die einzige Person, die du sein solltest, ist die beste Version von dir selbst. - Unbekannt",
  "Jeder Tag ist eine neue Chance, besser zu werden. - Unbekannt",
  "Disziplin ist die Brücke zwischen Zielen und Erfolg. - Jim Rohn",
];

export function Home() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-6xl mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          You vs You
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Der einzige Wettkampf, der zählt, ist der mit dir selbst. 
          Werde jeden Tag ein bisschen besser als gestern.
        </p>
        
        {/* Quote Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto border-l-4 border-purple-600">
          <p className="text-lg text-gray-700 italic">{quote}</p>
        </div>
      </div>

      {/* Project Overview */}
      <div className="mb-16">
        <h2 className="text-center mb-8 text-gray-800">Deine Self-Improvement Journey</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          YouvsYou ist deine gamifizierte Plattform für persönliche Entwicklung. 
          Tracke deine Ernährung, baue positive Gewohnheiten auf und trainiere deinen Geist 
          durch spielerische Herausforderungen. Alles an einem Ort.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div className="bg-gradient-to-br from-orange-400 to-red-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
            <Flame className="text-white" size={32} />
          </div>
          <h3 className="mb-4 text-gray-800">Kalorien Tracker</h3>
          <p className="text-gray-600">
            Verfolge deine tägliche Kalorienaufnahme, setze dir Ziele und erreiche 
            deine Ernährungsziele. Behalte den Überblick über deine Mahlzeiten und 
            optimiere deine Ernährung.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
            <Target className="text-white" size={32} />
          </div>
          <h3 className="mb-4 text-gray-800">Habit Tracker</h3>
          <p className="text-gray-600">
            Baue positive Gewohnheiten auf und tracke deinen Fortschritt. 
            Erstelle eigene Habits, markiere sie täglich ab und beobachte, 
            wie du kontinuierlich besser wirst.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div className="bg-gradient-to-br from-purple-400 to-indigo-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
            <Zap className="text-white" size={32} />
          </div>
          <h3 className="mb-4 text-gray-800">Game Space</h3>
          <p className="text-gray-600">
            Trainiere deine kognitiven Fähigkeiten mit spannenden Mini-Spielen. 
            Verbessere deine Reaktionszeit, dein Gedächtnis und deine 
            Konzentrationsfähigkeit durch spielerische Challenges.
          </p>
        </div>
      </div>

      {/* Motivation Section */}
      <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-12 text-white text-center">
        <Trophy className="mx-auto mb-6" size={48} />
        <h2 className="mb-4">Starte jetzt deine Reise</h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Jede große Veränderung beginnt mit einem kleinen Schritt. 
          Nutze die Tools oben in der Navigation und beginne heute, 
          die beste Version von dir selbst zu werden.
        </p>
      </div>
    </div>
  );
}
