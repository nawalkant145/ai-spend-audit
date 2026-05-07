'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuditForm } from '@/hooks/useAuditForm';
import { ToolName, UseCase } from '@/lib/audit/types';
import { Plus, Trash2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

const TOOLS: ToolName[] = [
  'Cursor', 'GitHub Copilot', 'Claude', 'ChatGPT', 
  'Anthropic API', 'OpenAI API', 'Gemini', 'Windsurf'
];

const USE_CASES: UseCase[] = ['coding', 'writing', 'data', 'research', 'mixed'];

export function SpendForm({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const { formData, updateTool, addTool, removeTool, setTeamSize, setUseCase } = useAuditForm();

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-center">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
              step === s ? 'bg-primary text-primary-foreground scale-110 shadow-lg' : 
              step > s ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
            }`}>
              {s}
            </div>
            {s < 3 && <div className={`w-20 h-1 transition-colors ${step > s ? 'bg-green-500' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="border-2 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="text-yellow-500" />
                  Your Profile
                </CardTitle>
                <CardDescription>Tell us about your team and how you use AI.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input 
                    id="teamSize" 
                    type="number" 
                    min={1} 
                    value={formData.teamSize} 
                    onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="useCase">Primary Use Case</Label>
                  <Select value={formData.primaryUseCase} onValueChange={(v) => setUseCase(v as UseCase)}>
                    <SelectTrigger className="text-lg capitalize">
                      <SelectValue placeholder="Select use case" />
                    </SelectTrigger>
                    <SelectContent>
                      {USE_CASES.map(u => (
                        <SelectItem key={u} value={u} className="capitalize">{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={nextStep} className="w-full h-12 text-lg group">
                  Next Step
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="border-2 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">AI Tool Stack</CardTitle>
                  <CardDescription>List the tools you're currently paying for.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => addTool({ toolName: 'ChatGPT', planName: 'Plus', monthlySpend: 20, seats: 1 })}>
                  <Plus className="mr-2 h-4 w-4" /> Add Tool
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.tools.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                    No tools added yet. Click "Add Tool" to begin.
                  </div>
                )}
                {formData.tools.map((tool, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4 relative group hover:border-primary transition-colors">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeTool(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tool</Label>
                        <Select value={tool.toolName} onValueChange={(v) => updateTool(index, { toolName: v as ToolName })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TOOLS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Plan</Label>
                        <Input 
                          placeholder="e.g. Pro, Team" 
                          value={tool.planName} 
                          onChange={(e) => updateTool(index, { planName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Monthly Spend ($)</Label>
                        <Input 
                          type="number" 
                          value={tool.monthlySpend} 
                          onChange={(e) => updateTool(index, { monthlySpend: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Seats</Label>
                        <Input 
                          type="number" 
                          value={tool.seats} 
                          onChange={(e) => updateTool(index, { seats: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={prevStep} className="flex-1">Back</Button>
                  <Button onClick={nextStep} className="flex-1" disabled={formData.tools.length === 0}>
                    Review Audit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="border-2 border-primary shadow-2xl bg-primary/5">
              <CardHeader>
                <CardTitle className="text-2xl">Ready for Audit?</CardTitle>
                <CardDescription>We've captured {formData.tools.length} tools across your {formData.teamSize}-person team.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <div className="p-6 bg-background rounded-xl border-2">
                  <p className="text-lg text-muted-foreground">Estimated Monthly Audit Value</p>
                  <p className="text-4xl font-bold text-primary mt-2">Free Instant Insight</p>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={prevStep} className="flex-1">Edit Info</Button>
                  <Button onClick={onComplete} className="flex-1 text-lg shadow-lg">
                    Run AI Audit Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
