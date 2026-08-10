import { describe, expect, it } from "vitest";
import { ALL_CONSTRUCTS, constructDef, scoreConstructs, statusFor } from "./mslq";

const QUESTIONS = [
  { id_questao: "q1", constructo: "Motivação", reversa: false },
  { id_questao: "q2", constructo: "Motivação", reversa: false },
  { id_questao: "q3", constructo: "Metacognição", reversa: false },
  { id_questao: "q4", constructo: "Metacognição", reversa: true },
];

describe("scoreConstructs", () => {
  it("calcula a média simples por construto", () => {
    const scores = scoreConstructs(QUESTIONS, { q1: 6, q2: 4 });
    expect(scores["Motivação"]).toBe(5);
  });

  it("inverte itens marcados como reversa (8 - valor)", () => {
    const scores = scoreConstructs(QUESTIONS, { q3: 5, q4: 5 });
    // q3 raw=5, q4 invertido = 8-5=3 → média (5+3)/2 = 4
    expect(scores["Metacognição"]).toBe(4);
  });

  it("ignora perguntas sem resposta", () => {
    const scores = scoreConstructs(QUESTIONS, { q1: 7 });
    expect(scores["Motivação"]).toBe(7);
    expect(scores["Metacognição"]).toBeUndefined();
  });

  it("retorna objeto vazio quando não há respostas", () => {
    expect(scoreConstructs(QUESTIONS, {})).toEqual({});
  });
});

describe("statusFor", () => {
  it("classifica como 'high' quando score >= limite (não invertido)", () => {
    expect(statusFor(5, 5)).toBe("high");
    expect(statusFor(6, 5)).toBe("high");
  });

  it("classifica como 'low' quando score < limite (não invertido)", () => {
    expect(statusFor(4, 5)).toBe("low");
  });

  it("inverte o sentido bom/ruim quando invertido=true", () => {
    expect(statusFor(6, 5, true)).toBe("low");
    expect(statusFor(4, 5, true)).toBe("high");
  });
});

describe("ALL_CONSTRUCTS / constructDef", () => {
  it("tem exatamente 6 construtos, todos não invertidos", () => {
    expect(ALL_CONSTRUCTS).toHaveLength(6);
    expect(ALL_CONSTRUCTS.every((c) => !c.invertido)).toBe(true);
  });

  it("constructDef encontra um construto existente pelo nome", () => {
    expect(constructDef("Motivação")?.icon).toBe("🎯");
  });

  it("constructDef retorna undefined para um construto inexistente", () => {
    expect(constructDef("Não existe")).toBeUndefined();
  });
});
