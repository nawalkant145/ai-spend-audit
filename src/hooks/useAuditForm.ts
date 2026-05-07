'use client';

import { useState, useEffect } from 'react';
import { AuditInput, ToolSpend, UseCase } from '@/lib/audit/types';

const STORAGE_KEY = 'lumina_audit_form';

const DEFAULT_STATE: AuditInput = {
  tools: [],
  teamSize: 1,
  primaryUseCase: 'mixed',
};

export function useAuditForm() {
  const [formData, setFormData] = useState<AuditInput>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved form data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, isLoaded]);

  const updateTool = (index: number, tool: Partial<ToolSpend>) => {
    setFormData((prev) => {
      const newTools = [...prev.tools];
      newTools[index] = { ...newTools[index], ...tool };
      return { ...prev, tools: newTools };
    });
  };

  const addTool = (tool: ToolSpend) => {
    setFormData((prev) => ({
      ...prev,
      tools: [...prev.tools, tool],
    }));
  };

  const removeTool = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index),
    }));
  };

  const setTeamSize = (size: number) => {
    setFormData((prev) => ({ ...prev, teamSize: size }));
  };

  const setUseCase = (useCase: UseCase) => {
    setFormData((prev) => ({ ...prev, primaryUseCase: useCase }));
  };

  const resetForm = () => {
    setFormData(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    formData,
    isLoaded,
    updateTool,
    addTool,
    removeTool,
    setTeamSize,
    setUseCase,
    resetForm,
  };
}
