import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Award, BookOpen, Compass, ShieldCheck } from 'lucide-react';

const quizQuestions = [
  {
    q: 'Which action has the highest carbon mitigation potential for typical office commutes?',
    options: ['Carpooling with peers', 'Taking electric high-speed rail', 'Transitioning 2 days to remote work', 'Regular tire pressure check'],
    correct: 1, // High speed rail / public transit has huge offset
    points: 10
  },
  {
    q: 'What is the primary output resource of an Anaerobic Digestion system?',
    options: ['Purified water', 'Biogas (primarily methane)', 'Solid plastic residue', 'Raw electricity'],
    correct: 1,
    points: 10
  },
  {
    q: 'How does secondary aluminum recycling compare to primary refining energy consumption?',
    options: ['Uses 10% more energy', 'Requires identical energy loads', 'Saves approximately 95% of process energy', 'Conserves only water, not electricity'],
    correct: 2,
    points: 10
  }
];

const Education: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (qIdx: number, oIdx: number) => {
    setAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleQuizSubmit = () => {
    let finalScore = 0;
    quizQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correct) {
        finalScore += q.points;
      }
    });
    setScore(finalScore);
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Sustainability Education Center</h1>
        <p className="text-muted-foreground">Learn key UN Sustainable Development Goals, greenhouse gas reduction methodologies, and test your green knowledge.</p>
      </div>

      {/* Interactive quiz */}
      <Card className="border border-primary/20">
        <CardHeader className="flex flex-row items-center gap-3">
          <Compass className="w-5 h-5 text-primary animate-pulse" />
          <div>
            <CardTitle className="text-base font-semibold">"How Sustainable Are You?" Quiz</CardTitle>
            <CardDescription>Test your baseline literacy on material lifecycles and energy offsets.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {quizQuestions.map((q, qIdx) => (
            <div key={qIdx} className="space-y-2">
              <p className="text-sm font-semibold">{qIdx + 1}. {q.q}</p>
              <RadioGroup value={answers[qIdx]?.toString()} onValueChange={(val) => handleSelect(qIdx, parseInt(val))}>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center space-x-2">
                    <RadioGroupItem value={oIdx.toString()} id={`q-${qIdx}-o-${oIdx}`} />
                    <Label htmlFor={`q-${qIdx}-o-${oIdx}`} className="text-xs font-normal">{opt}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          {!submitted ? (
            <Button onClick={handleQuizSubmit} className="w-full text-xs font-semibold">Submit Answers</Button>
          ) : (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center space-y-2">
              <Award className="w-8 h-8 text-primary mx-auto" />
              <p className="font-bold text-base">Your Awareness Score: {score} / 30</p>
              <p className="text-xs text-muted-foreground">Keep reviewing the syllabus cards below to increase environmental literacy!</p>
              <Button onClick={() => { setAnswers({}); setSubmitted(false); }} variant="outline" size="sm" className="text-xs">Retry Quiz</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Educational sections */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <div>
            <CardTitle className="text-base font-semibold">Sustainability Training Syllabus</CardTitle>
            <CardDescription>Review foundational principles of ecological engineering and materials science.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="climate">
              <AccordionTrigger>1. Climate Change & GHG Offsets</AccordionTrigger>
              <AccordionContent className="text-xs leading-relaxed space-y-2">
                <p>Greenhouse gases (GHG) trap solar heat in the atmosphere. Carbon dioxide (CO₂), methane (CH₄), and nitrous oxide (N₂O) are major industrial byproducts. Reforestation, transition to non-fossil utilities, and grid efficiency are critical components to limit global warming below 1.5°C.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="renewable">
              <AccordionTrigger>2. Clean Grid Technologies</AccordionTrigger>
              <AccordionContent className="text-xs leading-relaxed space-y-2">
                <p>Solar PV and wind turbines harness natural kinetic and radiant energy. Hydropower uses water turbines, while biomass utilizes organic matter. Diversifying these sources guarantees grid resilience without coal or methane gas power plant loading.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="waste">
              <AccordionTrigger>3. Lifecycle Materials Loop</AccordionTrigger>
              <AccordionContent className="text-xs leading-relaxed space-y-2">
                <p>Transitioning from a linear model (Take, Make, Waste) to a circular model (Reduce, Reuse, Recycle) reduces landfill loads. Composting returns organic nutrients to agriculture, and plastics recycling minimizes ocean microplastics.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="water">
              <AccordionTrigger>4. Water Stewardship</AccordionTrigger>
              <AccordionContent className="text-xs leading-relaxed space-y-2">
                <p>Efficient utilization, rainwater harvesting, greywater reuse, and leakage prevention limit municipal water reservoir stress. Lowering hot water consumption also yields secondary energy savings.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="materials">
              <AccordionTrigger>5. Low-Embodied Carbon Materials</AccordionTrigger>
              <AccordionContent className="text-xs leading-relaxed space-y-2">
                <p>Embodied carbon represents the carbon footprint of manufacturing, transporting, and installing building materials. Substituting fly-ash or slag concrete for standard Portland cement significantly reduces infrastructure carbon load.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Education;
