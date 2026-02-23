"use client";

import { useCVEditorStore, type ExperienceItem, type EducationItem, type SkillItem, type LanguageItem, type CertificationItem, type ProjectItem } from "@/store/cv-editor-store";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  GripVertical, Eye, EyeOff, PanelLeft, ChevronDown, ChevronUp,
  Plus, Trash2, ArrowUp, ArrowDown, Briefcase, GraduationCap,
  Zap, Globe, Award, FolderGit2
} from "lucide-react";
import { useState, useCallback } from "react";

// ─── Expandable section wrapper ─────────────────────────────────────────────
function SectionAccordion({
  sectionId,
  icon,
  label,
  enabled,
  inSidebar,
  onToggle,
  onSidebarToggle,
  onMoveUp,
  onMoveDown,
  children,
}: {
  sectionId: string;
  icon: string;
  label: string;
  enabled: boolean;
  inSidebar: boolean;
  onToggle: () => void;
  onSidebarToggle: (v: boolean) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  children?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn(
      "rounded-lg border transition-colors",
      enabled
        ? "border-stone-200 dark:border-stone-700"
        : "border-stone-100 dark:border-stone-800 opacity-60"
    )}>
      {/* Header row */}
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        {/* Drag handle + icon */}
        <div className="flex items-center gap-1 text-stone-400">
          <GripVertical className="h-3 w-3 cursor-grab" />
          <span className="text-sm">{icon}</span>
        </div>

        {/* Label */}
        <span className="text-xs font-medium text-stone-700 dark:text-stone-300 flex-1 truncate">
          {label}
        </span>

        {/* Sidebar badge */}
        {enabled && (
          <button
            onClick={() => onSidebarToggle(!inSidebar)}
            className={cn(
              "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors",
              inSidebar
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400 hover:bg-stone-200"
            )}
            title={inSidebar ? "Dans la sidebar" : "Dans la zone principale"}
          >
            <PanelLeft className="h-2.5 w-2.5" />
            {inSidebar ? "Sidebar" : "Principal"}
          </button>
        )}

        {/* Move up/down */}
        <div className="flex items-center">
          {onMoveUp && (
            <button onClick={onMoveUp} className="p-0.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded">
              <ArrowUp className="h-3 w-3 text-stone-400" />
            </button>
          )}
          {onMoveDown && (
            <button onClick={onMoveDown} className="p-0.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded">
              <ArrowDown className="h-3 w-3 text-stone-400" />
            </button>
          )}
        </div>

        {/* Enable toggle */}
        <Switch checked={enabled} onCheckedChange={onToggle} />

        {/* Expand */}
        {enabled && children && (
          <button onClick={() => setExpanded(!expanded)} className="p-0.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded">
            {expanded ? <ChevronUp className="h-3.5 w-3.5 text-stone-400" /> : <ChevronDown className="h-3.5 w-3.5 text-stone-400" />}
          </button>
        )}
      </div>

      {/* Content */}
      {expanded && enabled && children && (
        <div className="border-t border-stone-100 dark:border-stone-800 px-3 py-3">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Experience Editor ──────────────────────────────────────────────────────
function ExperienceEditor() {
  const { data, setExperience } = useCVEditorStore();
  const items = data.experience;

  const addItem = () => {
    setExperience([...items, {
      id: `exp-${Date.now()}`, position: "", company: "", location: "",
      startDate: "", endDate: "", current: false, description: "", bullets: []
    }]);
  };

  const updateItem = (index: number, field: keyof ExperienceItem, value: unknown) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setExperience(newItems);
  };

  const removeItem = (index: number) => {
    setExperience(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id} className="space-y-2 p-2 bg-stone-50 dark:bg-stone-900 rounded-md relative">
          <button
            onClick={() => removeItem(i)}
            className="absolute top-1 right-1 p-0.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
          >
            <Trash2 className="h-3 w-3 text-red-400" />
          </button>
          <Input value={item.position} onChange={(e) => updateItem(i, "position", e.target.value)} placeholder="Poste" className="h-7 text-xs" />
          <Input value={item.company} onChange={(e) => updateItem(i, "company", e.target.value)} placeholder="Entreprise" className="h-7 text-xs" />
          <div className="grid grid-cols-2 gap-1.5">
            <Input value={item.startDate} onChange={(e) => updateItem(i, "startDate", e.target.value)} placeholder="Début" className="h-7 text-xs" />
            <Input value={item.endDate} onChange={(e) => updateItem(i, "endDate", e.target.value)} placeholder="Fin" className="h-7 text-xs" disabled={item.current} />
          </div>
          <div className="flex items-center gap-1.5">
            <Switch checked={item.current} onCheckedChange={(v) => updateItem(i, "current", v)} />
            <Label className="text-[10px]">Poste actuel</Label>
          </div>
          <textarea
            value={item.description}
            onChange={(e) => updateItem(i, "description", e.target.value)}
            placeholder="Description..."
            rows={2}
            className="w-full rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 px-2 py-1 text-xs resize-none"
          />
        </div>
      ))}
      <Button onClick={addItem} variant="outline" size="sm" className="w-full text-xs">
        <Plus className="h-3 w-3 mr-1" /> Ajouter une expérience
      </Button>
    </div>
  );
}

// ─── Education Editor ───────────────────────────────────────────────────────
function EducationEditor() {
  const { data, setEducation } = useCVEditorStore();
  const items = data.education;

  const addItem = () => {
    setEducation([...items, {
      id: `edu-${Date.now()}`, degree: "", institution: "", field: "",
      startDate: "", endDate: "", description: ""
    }]);
  };

  const updateItem = (index: number, field: keyof EducationItem, value: string) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setEducation(newItems);
  };

  const removeItem = (index: number) => {
    setEducation(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id} className="space-y-2 p-2 bg-stone-50 dark:bg-stone-900 rounded-md relative">
          <button onClick={() => removeItem(i)} className="absolute top-1 right-1 p-0.5 hover:bg-red-100 rounded">
            <Trash2 className="h-3 w-3 text-red-400" />
          </button>
          <Input value={item.degree} onChange={(e) => updateItem(i, "degree", e.target.value)} placeholder="Diplôme" className="h-7 text-xs" />
          <Input value={item.institution} onChange={(e) => updateItem(i, "institution", e.target.value)} placeholder="Établissement" className="h-7 text-xs" />
          <Input value={item.field} onChange={(e) => updateItem(i, "field", e.target.value)} placeholder="Domaine" className="h-7 text-xs" />
          <div className="grid grid-cols-2 gap-1.5">
            <Input value={item.startDate} onChange={(e) => updateItem(i, "startDate", e.target.value)} placeholder="Début" className="h-7 text-xs" />
            <Input value={item.endDate} onChange={(e) => updateItem(i, "endDate", e.target.value)} placeholder="Fin" className="h-7 text-xs" />
          </div>
        </div>
      ))}
      <Button onClick={addItem} variant="outline" size="sm" className="w-full text-xs">
        <Plus className="h-3 w-3 mr-1" /> Ajouter une formation
      </Button>
    </div>
  );
}

// ─── Skills Editor ──────────────────────────────────────────────────────────
function SkillsEditor() {
  const { data, setSkills } = useCVEditorStore();
  const items = data.skills;
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setSkills([...items, { id: `skill-${Date.now()}`, name: newSkill.trim(), level: 3, category: "" }]);
    setNewSkill("");
  };

  const removeSkill = (index: number) => {
    setSkills(items.filter((_, i) => i !== index));
  };

  const updateLevel = (index: number, level: number) => {
    setSkills(items.map((item, i) => i === index ? { ...item, level } : item));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSkill()}
          placeholder="Ajouter une compétence..."
          className="h-7 text-xs flex-1"
        />
        <Button onClick={addSkill} size="sm" className="h-7 px-2 text-xs">
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <div className="space-y-1.5">
        {items.map((skill, i) => (
          <div key={skill.id} className="flex items-center gap-2 px-2 py-1 bg-stone-50 dark:bg-stone-900 rounded">
            <span className="text-xs flex-1 truncate">{skill.name}</span>
            {/* Level dots */}
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => updateLevel(i, lvl)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    lvl <= skill.level ? "bg-amber-500" : "bg-stone-300 dark:bg-stone-600"
                  )}
                />
              ))}
            </div>
            <button onClick={() => removeSkill(i)} className="p-0.5 hover:bg-red-100 rounded">
              <Trash2 className="h-2.5 w-2.5 text-red-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Languages Editor ───────────────────────────────────────────────────────
function LanguagesEditor() {
  const { data, setLanguages } = useCVEditorStore();
  const items = data.languages;

  const addItem = () => {
    setLanguages([...items, { id: `lang-${Date.now()}`, name: "", level: "" }]);
  };

  const updateItem = (index: number, field: keyof LanguageItem, value: string) => {
    setLanguages(items.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const removeItem = (index: number) => {
    setLanguages(items.filter((_, i) => i !== index));
  };

  const LEVELS = ["Débutant", "Intermédiaire", "Avancé", "Courant", "Natif"];

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={item.id} className="flex items-center gap-1.5 p-1.5 bg-stone-50 dark:bg-stone-900 rounded">
          <Input value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} placeholder="Langue" className="h-7 text-xs flex-1" />
          <select
            value={item.level}
            onChange={(e) => updateItem(i, "level", e.target.value)}
            className="h-7 text-xs rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 px-1.5"
          >
            <option value="">Niveau</option>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <button onClick={() => removeItem(i)} className="p-0.5 hover:bg-red-100 rounded">
            <Trash2 className="h-2.5 w-2.5 text-red-400" />
          </button>
        </div>
      ))}
      <Button onClick={addItem} variant="outline" size="sm" className="w-full text-xs">
        <Plus className="h-3 w-3 mr-1" /> Ajouter une langue
      </Button>
    </div>
  );
}

// ─── Certifications Editor ──────────────────────────────────────────────────
function CertificationsEditor() {
  const { data, setCertifications } = useCVEditorStore();
  const items = data.certifications;

  const addItem = () => {
    setCertifications([...items, { id: `cert-${Date.now()}`, name: "", issuer: "", date: "", url: "" }]);
  };

  const updateItem = (index: number, field: keyof CertificationItem, value: string) => {
    setCertifications(items.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const removeItem = (index: number) => {
    setCertifications(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={item.id} className="space-y-1.5 p-2 bg-stone-50 dark:bg-stone-900 rounded relative">
          <button onClick={() => removeItem(i)} className="absolute top-1 right-1 p-0.5 hover:bg-red-100 rounded">
            <Trash2 className="h-2.5 w-2.5 text-red-400" />
          </button>
          <Input value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} placeholder="Certification" className="h-7 text-xs" />
          <Input value={item.issuer} onChange={(e) => updateItem(i, "issuer", e.target.value)} placeholder="Organisme" className="h-7 text-xs" />
          <Input value={item.date} onChange={(e) => updateItem(i, "date", e.target.value)} placeholder="Date" className="h-7 text-xs" />
        </div>
      ))}
      <Button onClick={addItem} variant="outline" size="sm" className="w-full text-xs">
        <Plus className="h-3 w-3 mr-1" /> Ajouter une certification
      </Button>
    </div>
  );
}

// ─── Projects Editor ────────────────────────────────────────────────────────
function ProjectsEditor() {
  const { data, setProjects } = useCVEditorStore();
  const items = data.projects;

  const addItem = () => {
    setProjects([...items, { id: `proj-${Date.now()}`, name: "", description: "", technologies: [], url: "" }]);
  };

  const updateItem = (index: number, field: keyof ProjectItem, value: unknown) => {
    setProjects(items.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const removeItem = (index: number) => {
    setProjects(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={item.id} className="space-y-1.5 p-2 bg-stone-50 dark:bg-stone-900 rounded relative">
          <button onClick={() => removeItem(i)} className="absolute top-1 right-1 p-0.5 hover:bg-red-100 rounded">
            <Trash2 className="h-2.5 w-2.5 text-red-400" />
          </button>
          <Input value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} placeholder="Nom du projet" className="h-7 text-xs" />
          <textarea
            value={item.description}
            onChange={(e) => updateItem(i, "description", e.target.value)}
            placeholder="Description..."
            rows={2}
            className="w-full rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 px-2 py-1 text-xs resize-none"
          />
          <Input
            value={item.technologies.join(", ")}
            onChange={(e) => updateItem(i, "technologies", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
            placeholder="Technologies (séparées par des virgules)"
            className="h-7 text-xs"
          />
        </div>
      ))}
      <Button onClick={addItem} variant="outline" size="sm" className="w-full text-xs">
        <Plus className="h-3 w-3 mr-1" /> Ajouter un projet
      </Button>
    </div>
  );
}

// ─── Section type → editor component mapping ────────────────────────────────
const SECTION_EDITORS: Record<string, React.ComponentType> = {
  experience: ExperienceEditor,
  education: EducationEditor,
  skills: SkillsEditor,
  languages: LanguagesEditor,
  certifications: CertificationsEditor,
  projects: ProjectsEditor,
};

// ─── Main component ─────────────────────────────────────────────────────────
export function CVSectionsEditor() {
  const { sections, toggleSection, reorderSections, setSectionInSidebar } = useCVEditorStore();

  const sorted = [...sections].sort((a, b) => a.order - b.order);

  const moveUp = (index: number) => {
    if (index <= 0) return;
    reorderSections(index, index - 1);
  };

  const moveDown = (index: number) => {
    if (index >= sorted.length - 1) return;
    reorderSections(index, index + 1);
  };

  return (
    <div className="space-y-2 p-4 text-sm overflow-y-auto max-h-[calc(100vh-200px)]">
      <h3 className="font-semibold text-stone-800 dark:text-stone-200 mb-1">
        Sections du CV
      </h3>
      <p className="text-[10px] text-stone-400 mb-3">
        Activez, ordonnez et assignez chaque section à la sidebar ou à la zone principale.
      </p>

      <div className="space-y-1.5">
        {sorted.map((sec, i) => {
          const Editor = SECTION_EDITORS[sec.type];
          return (
            <SectionAccordion
              key={sec.id}
              sectionId={sec.id}
              icon={sec.icon}
              label={sec.label}
              enabled={sec.enabled}
              inSidebar={sec.inSidebar}
              onToggle={() => toggleSection(sec.id)}
              onSidebarToggle={(v) => setSectionInSidebar(sec.id, v)}
              onMoveUp={i > 0 ? () => moveUp(i) : undefined}
              onMoveDown={i < sorted.length - 1 ? () => moveDown(i) : undefined}
            >
              {Editor ? <Editor /> : (
                <p className="text-[10px] text-stone-400 italic">
                  Éditeur de contenu bientôt disponible pour cette section.
                </p>
              )}
            </SectionAccordion>
          );
        })}
      </div>
    </div>
  );
}
