# Sbírka sýrových etiket

Responzivní statická PWA s českým a anglickým rozhraním. Texty a obrázky se načítají ze samostatných očíslovaných souborů, takže je lze upravovat přímo na GitHubu bez změny kódu aplikace.

## Obsah, který lze upravovat

- `obsah/02_text_hlavicka_cz.txt` a `obsah/03_text_hlavicka_aj.txt` — dva řádky nadpisu.
- `obsah/04_menu_1_cz.txt` až `obsah/09_menu_3_aj.txt` — názvy tří položek menu.
- `obsah/14_text_menu_1_cz.md` až `obsah/19_text_menu_3_aj.md` — texty těla v Markdownu.
- `assets/01_obr_hlavicka.png` — obrázek v hlavičce.
- `assets/10_obr_bok_1.png` až `assets/13_obr_bok_4.png` — čtyři dekorativní obrázky vpravo.

Obrázky se zobrazují celé bez ořezu. Při jejich výměně zachovejte název souboru i příponu. V textových souborech zachovejte kódování UTF-8.

### Odkazy v textech

V souborech `.md` vložte odkaz ve formátu `[popisek odkazu](https://adresa)`. Odkaz se otevře v nové kartě. V českém textu #18 a anglickém textu #19 je zatím dočasný odkaz na domovskou stránku Google Photos; nahraďte ho odkazem na sbírku.

## Náhled a nasazení

Otevřete projekt přes lokální HTTP server; PWA a service worker nefungují při otevření přes `file://`. Projekt nevyžaduje sestavení. Pro GitHub Pages zvolte v nastavení repozitáře nasazení z větve `main` a složky `/ (root)`.
