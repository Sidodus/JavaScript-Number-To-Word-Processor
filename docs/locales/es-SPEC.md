# Locale SPEC: `es` (Español)

Status: **IMPLEMENTED in 4.6.0**. Register: modern standard Spanish per RAE;
**masculine forms throughout** (the engine has no gender context — feminine
*una/veintiuna/doscientas* documented but unmodeled).

## 1. Authoritative sources

- [RAE DPD — cardinales](https://www.rae.es/dpd/cardinales) (cien/ciento split, apocope, mil/millones)
- [RAE — Tabla de numerales](https://www.rae.es/buen-uso-español/tabla-de-numerales) (the 1–10¹² word table)
- [RAE DPD — ordinales](https://www.rae.es/dpd/ordinales) + [Fundéu](https://www.fundeu.es/noticia/la-esquina-del-idioma-como-se-dice-cuatrocientos-diez-y-quinientos-diez-en-numeros-ordinales) (ordinal forms)

## 2. 0..99 table (generated)

- 0 cero; 1 uno; 2 dos ... 10 diez; 11 once; 12 doce; 13 trece; 14 catorce;
  15 quince; 16 **dieciséis**; 17 diecisiete; 18 dieciocho; 19 diecinueve
- 20 veinte; 21–29 **veinti- contractions**: veintiuno, veintidós, veintitrés,
  veinticuatro, veinticinco, **veintiséis**, veintisiete, veintiocho, veintinueve
- 30–90: treinta, cuarenta, cincuenta, sesenta, setenta, ochenta, noventa
- 31–99: **tens + y + unit** (treinta y uno, cuarenta y dos ...)

## 3. Hundreds (irregular chain, RAE table)

100 **cien** (bare; also before mil/millones: cien mil, cien millones) ·
101+ **ciento** (ciento uno, ciento veinte) · 200 doscientos · 300 trescientos ·
400 cuatrocientos · 500 **quinientos** · 600 seiscientos · 700 **setecientos** ·
800 ochocientos · 900 **novecientos** (the 5/7/9 forms are irregular — do not
regularize). Remainder juxtaposes: doscientos cuarenta y cinco.

## 4. Thousands & apocope

1,000 **mil** (bare) · 2,000–999,000 **multiplier + mil** with the RAE apocope:
21,000 **veintiún mil** (uno → un/veintiún before mil); 100,000 **cien mil**;
101,000 ciento un mil. Within the thousands group everything is the ordinary
0..999 chain: 234,000 = doscientos treinta y cuatro mil.

## 5. Millions (RAE long scale)

1,000,000 **un millón** (apocope uno → un) · 2,000,000+ **millones + group**
(dos millones, cinco millones ...) · 1,000,000,000 **mil millones** (RAE; also
"un millardo") · 10¹² **un billón** / X billones · 10¹⁵ **mil billones** ·
10¹⁸ trillón · 10²⁴ cuatrillón — the even group indexes use the Spanish illion
series (millón, billón, trillón, cuatrillón ... decillón) and odd indexes are
"mil" + the previous plural. Beyond decillón (10⁶⁰): English code-switch
(documented practice). Pluralization: millón → millones (accent dropped).

## 6. Ordinals & decimals

- **Cardinal-style ordinals**: Spanish ordinals (primero, segundo, tercero,
  vigésimo primero, apocopated primer/tercer...) are a separate lexical
  system with widespread periphrastic preference ("el número 21") — NOT
  implemented; ordinal output rejects loudly.
- **Decimal ordinals — implemented** (`decimalOrdinal`): décimas (10⁻¹),
  centésimas (10⁻²), milésimas (10⁻³), diezmilésimas (10⁻⁴), cienmilésimas
  (10⁻⁵), millonésimas (10⁻⁶), milmillionésimas→**milmillonésimas** (10⁻⁹),
  billonésimas (10⁻¹²)... mirroring the RAE scale. Gender note: feminine -a
  forms are standard for decimal fractions.

## 7. Worked examples → test assertions

| Input | displayWord |
|-------|-------------|
| 0 / 1 / 16 / 21 / 29 | cero / uno / dieciséis / veintiuno / veintinueve |
| 30 / 31 / 50 / 99 | treinta / treinta y uno / cincuenta / noventa y nueve |
| 100 / 101 / 150 / 200 / 500 / 900 | cien / ciento uno / ciento cincuenta / doscientos / quinientos / novecientos |
| 999 | novecientos noventa y nueve |
| 1000 / 1001 / 1100 / 2000 | mil / mil uno / mil cien / dos mil |
| 21000 / 100000 / 101000 | veintiún mil / cien mil / ciento un mil |
| 1000000 / 2000000 / 5000000 | un millón / dos millones / cinco millones |
| 1000000000 / 5000000000 | mil millones / cinco mil millones |
| 1000000000000 / 2000000000000 | un billón / dos billones |
| 1234567 | un millón doscientos treinta y cuatro mil quinientos sesenta y siete |
| 0.1 / 0.01 / 0.001 | cero (punto) una décima / ... una centésima / ... una milésima |
| -5 | (negative) cinco |
