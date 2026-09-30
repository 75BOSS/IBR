import assert from 'node:assert/strict';
import { test } from 'node:test';
import { csvCell, toCsv } from '@/lib/csv';

test('csvCell escapa comillas y neutraliza fórmulas', () => {
  assert.equal(csvCell('Ana "la" Pérez'), '"Ana ""la"" Pérez"');
  assert.equal(csvCell('=HYPERLINK("x")'), `"'=HYPERLINK(""x"")"`);
  assert.equal(csvCell(null), '""');
  assert.equal(csvCell(3), '"3"');
});

test('toCsv usa «;», CRLF y BOM', () => {
  assert.equal(toCsv(['a', 'b'], [[1, 'x']]), '﻿"a";"b"\r\n"1";"x"');
});
