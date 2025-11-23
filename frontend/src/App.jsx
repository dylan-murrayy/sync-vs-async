import React, { useState } from 'react';
import { Activity, Server, ArrowRight, Clock, Zap, AlertCircle, CheckCircle2, Database, Layers } from 'lucide-react';

function ExpandableConcept({ title, icon: Icon, color, children }) {
    const [isOpen, setIsOpen] = useState(false);
    const colorClasses = {
        red: 'text-red-900 bg-red-50 hover:bg-red-100 border-red-100',
        blue: 'text-blue-900 bg-blue-50 hover:bg-blue-100 border-blue-100',
        gray: 'text-gray-900 bg-gray-50 hover:bg-gray-100 border-gray-100'
    };

    return (
        <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-md' : 'shadow-sm'} ${colorClasses[color].replace('text-', 'border-').split(' ')[3]}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-4 flex items-center justify-between text-left ${colorClasses[color]}`}
            >
                <div className="flex items-center font-bold">
                    <Icon className={`w-5 h-5 mr-3 ${color === 'red' ? 'text-red-600' : color === 'blue' ? 'text-blue-600' : 'text-gray-600'}`} />
                    {title}
                </div>
                {isOpen ? <div className="text-xs font-bold uppercase tracking-wider opacity-50">Close</div> : <div className="text-xs font-bold uppercase tracking-wider opacity-50">Learn More</div>}
            </button>
            {isOpen && (
                <div className="p-4 bg-white text-sm text-gray-600 leading-relaxed border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
}

function ArchitectureWizard() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});

    const questions = [
        {
            id: 'immediate',
            text: "Does the user need the result IMMEDIATELY to continue?",
            subtext: "Example: Logging in, Searching, Loading a profile.",
            options: [
                { label: "Yes, they are blocked", value: 'sync' },
                { label: "No, they can wait", value: 'async' }
            ]
        },
        {
            id: 'duration',
            text: "How long does the task usually take?",
            subtext: "Estimate the processing time.",
            options: [
                { label: "Under 300ms (Fast)", value: 'sync' },
                { label: "Over 300ms (Slow)", value: 'async' }
            ]
        },
        {
            id: 'criticality',
            text: "What happens if the service crashes?",
            subtext: "Is data loss acceptable?",
            options: [
                { label: "User retries (It's fine)", value: 'sync' },
                { label: "Must process eventually (Critical)", value: 'async' }
            ]
        }
    ];

    const handleAnswer = (value) => {
        const newAnswers = { ...answers, [questions[step].id]: value };
        setAnswers(newAnswers);
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            setStep('result');
        }
    };

    const reset = () => {
        setStep(0);
        setAnswers({});
    };

    const getResult = () => {
        const syncScore = Object.values(answers).filter(a => a === 'sync').length;
        if (answers.immediate === 'sync') return 'SYNC'; // Hard requirement
        if (syncScore > 1) return 'SYNC';
        return 'ASYNC';
    };

    if (step === 'result') {
        const result = getResult();
        return (
            <div className="bg-gray-800 text-white p-8 rounded-xl text-center animate-in zoom-in duration-300">
                <div className="mb-4">
                    {result === 'SYNC' ? <Layers className="w-16 h-16 mx-auto text-red-400" /> : <Zap className="w-16 h-16 mx-auto text-blue-400" />}
                </div>
                <h3 className="text-2xl font-bold mb-2">Recommendation: {result === 'SYNC' ? 'Synchronous' : 'Asynchronous'}</h3>
                <p className="text-gray-300 mb-6">
                    {result === 'SYNC'
                        ? "Your user needs an immediate answer. Keep it simple and block until done."
                        : "Your task is slow or non-critical to the immediate flow. Offload it to a queue!"}
                </p>
                <button onClick={reset} className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">
                    Start Over
                </button>
            </div>
        );
    }

    const question = questions[step];

    return (
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm min-h-[300px] flex flex-col justify-center">
            <div className="mb-8">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Question {step + 1} of 3</span>
                <h3 className="text-xl font-bold text-gray-900 mt-2">{question.text}</h3>
                <p className="text-gray-500 mt-1">{question.subtext}</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {question.options.map((opt) => (
                    <button
                        key={opt.label}
                        onClick={() => handleAnswer(opt.value)}
                        className="p-4 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 text-left transition-all group"
                    >
                        <span className="font-bold text-gray-700 group-hover:text-blue-700">{opt.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

function ComparisonTable() {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-3">Metric</th>
                        <th className="px-6 py-3 text-red-700">Synchronous</th>
                        <th className="px-6 py-3 text-blue-700">Asynchronous</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    <tr className="bg-white">
                        <td className="px-6 py-4 font-medium text-gray-900">User Experience</td>
                        <td className="px-6 py-4 text-gray-600">Waits for completion (Blocked)</td>
                        <td className="px-6 py-4 text-gray-600">Instant "Accepted" (Non-blocking)</td>
                    </tr>
                    <tr className="bg-white">
                        <td className="px-6 py-4 font-medium text-gray-900">Complexity</td>
                        <td className="px-6 py-4 text-gray-600">Low (Easy to debug)</td>
                        <td className="px-6 py-4 text-gray-600">Medium (Requires Broker & Workers)</td>
                    </tr>
                    <tr className="bg-white">
                        <td className="px-6 py-4 font-medium text-gray-900">Failure Handling</td>
                        <td className="px-6 py-4 text-gray-600">Fails immediately (User sees error)</td>
                        <td className="px-6 py-4 text-gray-600">Retries in background (Resilient)</td>
                    </tr>
                    <tr className="bg-white">
                        <td className="px-6 py-4 font-medium text-gray-900">Scalability</td>
                        <td className="px-6 py-4 text-gray-600">Limited by thread pool</td>
                        <td className="px-6 py-4 text-gray-600">High (Buffer absorbs spikes)</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

function App() {
    const [logs, setLogs] = useState([]);
    const [syncLoading, setSyncLoading] = useState(false);
    const [asyncLoading, setAsyncLoading] = useState(false);

    const addLog = (type, duration, status) => {
        const newLog = {
            id: Date.now(),
            type,
            duration,
            status,
            timestamp: new Date().toLocaleTimeString()
        };
        setLogs(prev => [newLog, ...prev]);
    };

    const handleSyncCheckout = async () => {
        setSyncLoading(true);
        const startTime = performance.now();
        try {
            const response = await fetch('http://localhost:8000/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: `sync-${Date.now()}`, amount: 100 })
            });
            if (!response.ok) throw new Error('Failed');
            await response.json();
            const endTime = performance.now();
            addLog('SYNC', (endTime - startTime).toFixed(0), 'SUCCESS');
        } catch (e) {
            addLog('SYNC', (performance.now() - startTime).toFixed(0), 'FAILED');
        } finally {
            setSyncLoading(false);
        }
    };

    const handleAsyncCheckout = async () => {
        setAsyncLoading(true);
        const startTime = performance.now();
        try {
            const response = await fetch('http://localhost:8001/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: `async-${Date.now()}`, amount: 100 })
            });
            if (!response.ok) throw new Error('Failed');
            await response.json();
            const endTime = performance.now();
            addLog('ASYNC', (endTime - startTime).toFixed(0), 'SUCCESS');
        } catch (e) {
            addLog('ASYNC', (performance.now() - startTime).toFixed(0), 'FAILED');
        } finally {
            setTimeout(() => setAsyncLoading(false), 500); // Keep animation briefly to show "sent"
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Sync vs Async Architecture</h1>
                    <p className="text-gray-500 text-lg">Side-by-side Comparison</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

                    {/* --- SYNC COLUMN --- */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                        <div className="p-6 bg-red-50 border-b border-red-100">
                            <h2 className="text-xl font-bold text-red-900 flex items-center">
                                <Layers className="w-6 h-6 mr-2" />
                                Synchronous (Blocking)
                            </h2>
                            <p className="text-red-700 text-sm mt-1">Checkout waits for Payment to finish.</p>
                        </div>

                        <div className="p-8 flex-grow flex flex-col items-center justify-center relative min-h-[300px]">
                            <div className="flex items-center space-x-4 w-full justify-center">
                                {/* Checkout Service */}
                                <div className="flex flex-col items-center z-10">
                                    <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 border-2 ${syncLoading ? 'bg-red-50 border-red-500 scale-105' : 'bg-white border-gray-200'}`}>
                                        <Server className={`w-10 h-10 ${syncLoading ? 'text-red-500' : 'text-gray-400'}`} />
                                    </div>
                                    <span className="mt-3 font-bold text-gray-700">Checkout</span>
                                </div>

                                {/* Connection Line */}
                                <div className="flex-1 max-w-[120px] h-1 bg-gray-100 relative">
                                    <div className={`absolute inset-0 bg-red-500 transition-all duration-[3000ms] ease-linear ${syncLoading ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
                                </div>

                                {/* Payment Service */}
                                <div className="flex flex-col items-center z-10">
                                    <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 border-2 ${syncLoading ? 'bg-red-50 border-red-500 animate-pulse' : 'bg-white border-gray-200'}`}>
                                        <Activity className={`w-10 h-10 ${syncLoading ? 'text-red-500' : 'text-gray-400'}`} />
                                    </div>
                                    <span className="mt-3 font-bold text-gray-700">Payment</span>
                                </div>
                            </div>

                            {syncLoading && (
                                <div className="absolute bottom-4 text-red-500 font-mono text-sm animate-pulse">
                                    Waiting for response... (3s)
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={handleSyncCheckout}
                                disabled={syncLoading}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center
                  ${syncLoading
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg'
                                    }`}
                            >
                                {syncLoading ? 'Blocked...' : 'Trigger Sync Checkout'}
                            </button>
                        </div>
                    </div>

                    {/* --- ASYNC COLUMN --- */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                        <div className="p-6 bg-blue-50 border-b border-blue-100">
                            <h2 className="text-xl font-bold text-blue-900 flex items-center">
                                <Zap className="w-6 h-6 mr-2" />
                                Asynchronous (Non-blocking)
                            </h2>
                            <p className="text-blue-700 text-sm mt-1">Checkout sends message and returns instantly.</p>
                        </div>

                        <div className="p-8 flex-grow flex flex-col items-center justify-center relative min-h-[300px]">
                            <div className="flex items-center space-x-4 w-full justify-center">
                                {/* Checkout Service */}
                                <div className="flex flex-col items-center z-10">
                                    <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 border-2 ${asyncLoading ? 'bg-blue-50 border-blue-500 scale-105' : 'bg-white border-gray-200'}`}>
                                        <Server className={`w-10 h-10 ${asyncLoading ? 'text-blue-500' : 'text-gray-400'}`} />
                                    </div>
                                    <span className="mt-3 font-bold text-gray-700">Checkout</span>
                                </div>

                                {/* Arrow / Message */}
                                <div className="flex-1 max-w-[120px] flex items-center justify-center relative">
                                    {asyncLoading ? (
                                        <div className="absolute w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                                    ) : (
                                        <ArrowRight className="text-gray-200 w-8 h-8" />
                                    )}
                                </div>

                                {/* Queue / RabbitMQ */}
                                <div className="flex flex-col items-center z-10">
                                    <div className="w-24 h-24 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Database className="w-10 h-10 text-orange-500" />
                                    </div>
                                    <span className="mt-3 font-bold text-gray-700">Message Queue</span>
                                </div>
                            </div>

                            {asyncLoading && (
                                <div className="absolute bottom-4 text-blue-500 font-mono text-sm">
                                    Message Sent! (Instant)
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={handleAsyncCheckout}
                                disabled={asyncLoading}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center
                  ${asyncLoading
                                        ? 'bg-blue-400 text-white cursor-default'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                                    }`}
                            >
                                {asyncLoading ? 'Sent!' : 'Trigger Async Checkout'}
                            </button>
                        </div>
                    </div>

                </div>

                {/* Logs */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-lg flex items-center text-gray-700">
                            <Clock className="w-5 h-5 mr-2 text-gray-400" />
                            Performance Log
                        </h3>
                        <span className="text-xs font-medium px-2 py-1 bg-gray-200 rounded-full text-gray-600">{logs.length} requests</span>
                    </div>

                    <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto">
                        {logs.length === 0 && (
                            <div className="p-12 text-center text-gray-400 italic">
                                No requests yet. Try both buttons above!
                            </div>
                        )}
                        {logs.map((log) => (
                            <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2 rounded-full ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {log.status === 'SUCCESS' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">Order #{log.id.toString().slice(-6)}</div>
                                        <div className="text-xs text-gray-400">{log.timestamp}</div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-6">
                                    <div className="text-right">
                                        <div className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Latency</div>
                                        <div className={`font-mono font-bold text-lg ${log.type === 'SYNC' ? 'text-red-600' : 'text-blue-600'}`}>
                                            {log.duration}ms
                                        </div>
                                    </div>

                                    <div className={`w-24 text-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${log.type === 'SYNC'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {log.type}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Explanation Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

                    {/* SYNC EXPLANATION */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-lg mb-6 text-red-900 flex items-center">
                            <Layers className="w-5 h-5 mr-2" />
                            Under the Hood: Synchronous
                        </h3>

                        {/* Sync Animation Container */}
                        <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 mb-6 relative overflow-hidden h-32 flex items-center">
                            {/* Nodes */}
                            <div className="absolute left-6 flex flex-col items-center z-10">
                                <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center shadow-sm">
                                    <Server className="w-6 h-6 text-gray-500" />
                                </div>
                                <span className="text-xs font-bold text-gray-500 mt-1">Checkout</span>
                            </div>

                            <div className="absolute right-6 flex flex-col items-center z-10">
                                <div className="w-12 h-12 bg-white border-2 border-red-200 rounded-lg flex items-center justify-center shadow-sm">
                                    <Activity className="w-6 h-6 text-red-500" />
                                </div>
                                <span className="text-xs font-bold text-gray-500 mt-1">Payment</span>
                            </div>

                            {/* Path */}
                            <div className="absolute left-12 right-12 h-1 bg-gray-200 top-1/2 -translate-y-1/2 z-0"></div>

                            {/* Moving Packet */}
                            <div className="absolute left-12 top-1/2 -translate-y-1/2 z-20 animate-flow-sync">
                                <div className="w-4 h-4 bg-red-500 rounded-full shadow-md"></div>
                            </div>

                            {/* Blocking Label */}
                            <div className="absolute top-2 w-full text-center">
                                <span className="text-[10px] font-mono text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100">
                                    Request BLOCKED waiting for response
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <ExpandableConcept title="Cascading Latency" icon={Clock} color="red">
                                <p className="mb-2"><strong>The Problem:</strong> In a sync chain (A calls B calls C), the total wait time is the <em>sum</em> of all service times. If C is slow, A is slow.</p>
                                <p className="italic text-red-700 bg-red-50 p-2 rounded">"It's like being stuck in traffic behind a broken-down car. Everyone behind it stops too."</p>
                            </ExpandableConcept>
                            <ExpandableConcept title="Tight Coupling" icon={AlertCircle} color="red">
                                <p className="mb-2"><strong>The Problem:</strong> Services are physically connected. If Payment crashes, Checkout throws an error immediately.</p>
                                <p className="italic text-red-700 bg-red-50 p-2 rounded">"It's like a three-legged race. If your partner trips, you faceplant."</p>
                            </ExpandableConcept>
                        </div>
                    </div>

                    {/* ASYNC EXPLANATION */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-lg mb-6 text-blue-900 flex items-center">
                            <Database className="w-5 h-5 mr-2" />
                            Under the Hood: Asynchronous
                        </h3>

                        {/* Async Animation Container */}
                        <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 mb-6 relative overflow-hidden h-32 flex items-center">

                            {/* Nodes */}
                            <div className="absolute left-6 flex flex-col items-center z-10">
                                <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center shadow-sm">
                                    <Server className="w-6 h-6 text-gray-500" />
                                </div>
                                <span className="text-xs font-bold text-gray-500 mt-1">Checkout</span>
                            </div>

                            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                                <div className="w-12 h-12 bg-white border-2 border-orange-300 rounded-lg flex items-center justify-center shadow-sm">
                                    <Database className="w-6 h-6 text-orange-500" />
                                </div>
                                <span className="text-xs font-bold text-gray-500 mt-1">Queue</span>
                            </div>

                            <div className="absolute right-6 flex flex-col items-center z-10">
                                <div className="w-12 h-12 bg-white border-2 border-blue-200 rounded-lg flex items-center justify-center shadow-sm">
                                    <Activity className="w-6 h-6 text-blue-500" />
                                </div>
                                <span className="text-xs font-bold text-gray-500 mt-1">Worker</span>
                            </div>

                            {/* Paths */}
                            <div className="absolute left-12 right-1/2 h-1 bg-gray-200 top-1/2 -translate-y-1/2 z-0"></div>
                            <div className="absolute left-1/2 right-12 h-1 bg-dashed bg-gray-300 top-1/2 -translate-y-1/2 z-0"></div>

                            {/* Moving Packet 1 (Request) */}
                            <div className="absolute left-12 top-1/2 -translate-y-1/2 z-20 animate-flow-async-request">
                                <div className="w-4 h-4 bg-blue-500 rounded-full shadow-md"></div>
                            </div>

                            {/* Moving Packet 2 (Worker) */}
                            <div className="absolute left-1/2 top-1/2 -translate-y-1/2 z-20 animate-flow-async-worker">
                                <div className="w-4 h-4 bg-orange-500 rounded-full shadow-md opacity-50"></div>
                            </div>

                            {/* Instant Label */}
                            <div className="absolute top-2 left-6">
                                <span className="text-[10px] font-mono text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                    202 Accepted
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <ExpandableConcept title="Non-Blocking I/O" icon={Zap} color="blue">
                                <p className="mb-2"><strong>The Benefit:</strong> The server hands off the work and immediately returns to help the next user. It never waits.</p>
                                <p className="italic text-blue-700 bg-blue-50 p-2 rounded">"It's like dropping a letter in the mailbox. You don't stand there waiting for the mailman to deliver it."</p>
                            </ExpandableConcept>
                            <ExpandableConcept title="Load Leveling" icon={Layers} color="blue">
                                <p className="mb-2"><strong>The Benefit:</strong> If traffic spikes, the Queue absorbs it. The worker processes at a safe, steady pace.</p>
                                <p className="italic text-blue-700 bg-blue-50 p-2 rounded">"It's like a dam. The reservoir (Queue) holds the flood, letting water (requests) through safely."</p>
                            </ExpandableConcept>
                        </div>
                    </div>
                </div>


                {/* Decision Matrix Section */}
                <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 bg-gray-900 text-white">
                        <h3 className="text-xl font-bold flex items-center">
                            <CheckCircle2 className="w-6 h-6 mr-2 text-green-400" />
                            The Decision Matrix: When to use what?
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                        {/* Interactive Wizard */}
                        <div className="p-8 lg:col-span-1 bg-gray-50">
                            <h4 className="font-bold text-gray-900 mb-6 flex items-center">
                                <Activity className="w-5 h-5 mr-2 text-purple-600" />
                                Architecture Wizard
                            </h4>
                            <ArchitectureWizard />
                        </div>

                        {/* Comparison Table */}
                        <div className="p-8 lg:col-span-2">
                            <h4 className="font-bold text-gray-900 mb-6 flex items-center">
                                <Layers className="w-5 h-5 mr-2 text-gray-600" />
                                Quick Comparison Cheat Sheet
                            </h4>
                            <ComparisonTable />
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}

export default App;
