import { describe, expect, it } from "vitest";
import { cronbachAlpha, median } from "./stats";

describe("cronbachAlpha", () => {
  it("retorna null com menos de 2 respondentes", () => {
    expect(cronbachAlpha([[1, 2, 3]])).toBeNull();
  });

  it("retorna null com menos de 2 itens", () => {
    expect(cronbachAlpha([[1], [2], [3]])).toBeNull();
  });

  it("retorna null quando a variância total é zero (todas as respostas iguais)", () => {
    const matrix = [
      [4, 4, 4, 4],
      [4, 4, 4, 4],
      [4, 4, 4, 4],
    ];
    expect(cronbachAlpha(matrix)).toBeNull();
  });

  it("retorna 1 quando os itens são perfeitamente consistentes entre si", () => {
    const matrix = [
      [1, 1, 1, 1],
      [3, 3, 3, 3],
      [5, 5, 5, 5],
      [7, 7, 7, 7],
    ];
    expect(cronbachAlpha(matrix)).toBeCloseTo(1, 6);
  });

  it("calcula um alfa intermediário para respostas parcialmente consistentes", () => {
    const matrix = [
      [7, 6, 7, 5],
      [1, 2, 1, 3],
      [5, 5, 4, 6],
      [2, 3, 2, 1],
      [6, 7, 6, 7],
    ];
    const alpha = cronbachAlpha(matrix);
    expect(alpha).not.toBeNull();
    expect(alpha!).toBeGreaterThan(0.5);
    expect(alpha!).toBeLessThan(1);
  });
});

describe("median", () => {
  it("retorna null para lista vazia", () => {
    expect(median([])).toBeNull();
  });

  it("retorna o valor do meio para lista de tamanho ímpar", () => {
    expect(median([3, 1, 2])).toBe(2);
  });

  it("retorna a média dos dois valores centrais para lista de tamanho par", () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });
});
