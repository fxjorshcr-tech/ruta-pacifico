/**
 * Badge "Powered by MaxDigital CR" del footer.
 *
 * Autocontenido a propósito (SVG en línea + CSS propio con prefijo `mdcr-`):
 * se ve idéntico en todos los sitios sin depender de Tailwind, de imágenes
 * remotas ni de la configuración de next/image. No lo reestilices por sitio;
 * usa `className` solo para el espaciado alrededor.
 */
const CSS = `.mdcr-wrap{display:flex;justify-content:center}
.mdcr-badge{box-sizing:border-box;display:inline-flex;flex-direction:column;align-items:center;gap:12px;max-width:100%;padding:20px 32px;border-radius:14px;background:#161B22;border:1px solid rgba(255,255,255,.14);font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1;text-align:center;text-decoration:none!important;transition:border-color .3s ease,box-shadow .3s ease}
.mdcr-badge:hover,.mdcr-badge:focus-visible{border-color:rgba(198,241,53,.55);box-shadow:0 12px 32px -14px rgba(198,241,53,.45)}
.mdcr-badge:focus-visible{outline:2px solid #C6F135;outline-offset:3px}
.mdcr-eyebrow{font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#C6F135;opacity:.8;transition:opacity .3s ease}
.mdcr-logo{display:block;width:290px;max-width:100%;height:auto;transition:transform .3s ease}
.mdcr-tagline{font-size:12px;font-weight:400;letter-spacing:normal;text-transform:none;color:#8B949E;transition:color .3s ease}
.mdcr-badge:hover .mdcr-eyebrow{opacity:1}
.mdcr-badge:hover .mdcr-logo{transform:scale(1.03)}
.mdcr-badge:hover .mdcr-tagline{color:#C9D1D9}
@media (prefers-reduced-motion:reduce){.mdcr-badge,.mdcr-badge *{transition:none}.mdcr-badge:hover .mdcr-logo{transform:none}}`;

export default function PoweredByMaxDigital({ className = "" }: { className?: string }) {
  return (
    <div className={`mdcr-wrap ${className}`.trim()}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <a
        className="mdcr-badge"
        href="https://maxdigitalcr.com"
        target="_blank"
        rel="noopener"
        aria-label="Powered by MaxDigital CR — Desarrollo web en Costa Rica"
      >
        <span className="mdcr-eyebrow">Powered by</span>
        <svg
          className="mdcr-logo"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -24 7534 778"
          aria-hidden="true"
          focusable="false"
        >
          <path fill="#FFFFFF" d="M90 730V0H284L467 436H485L667 0H864V730H723V152L544 581H399L220 154V730ZM992 730 1241 0H1473L1729 730H1583L1516 536H1198L1134 730ZM1475 416 1374 119H1337L1238 416Z" />
          <path fill="#C6F135" d="M1797 0 L1992.1 313 L2074.6 180.6 L1962 0 Z M2417 730 L2221.9 417 L2139.4 549.4 L2252 730 Z" />
          <path fill="#FFFFFF" d="M2252 0 L2417 0 L1962 730 L1797 730 ZM2557 734V-5H2821Q2920 -5 2994 24Q3068 53 3117 103.5Q3166 154 3190.5 218.5Q3215 283 3215 352V374Q3215 440 3190.5 504Q3166 568 3117 620Q3068 672 2994 703Q2920 734 2821 734ZM2699 127V602H2830Q2887 602 2931.5 584.5Q2976 567 3007 535Q3038 503 3054.5 459.5Q3071 416 3071 363Q3071 308 3054.5 264.5Q3038 221 3007 190Q2976 159 2931.5 143Q2887 127 2830 127ZM3364 730V0H3506V730ZM4048 749Q3954 749 3882.5 717.5Q3811 686 3762.5 632.5Q3714 579 3689.5 511.5Q3665 444 3665 371V349Q3665 280 3689 214Q3713 148 3759.5 95Q3806 42 3874.5 10.5Q3943 -21 4032 -21Q4128 -21 4202 14.5Q4276 50 4321 113.5Q4366 177 4374 261H4231Q4224 214 4196 180.5Q4168 147 4125.5 129Q4083 111 4032 111Q3981 111 3939.5 129Q3898 147 3869 180Q3840 213 3824.5 259Q3809 305 3809 361Q3809 422 3826 470Q3843 518 3874 551.5Q3905 585 3949 602.5Q3993 620 4048 620Q4121 620 4176 589Q4209 571 4231 546V465H4025V359H4423V465H4362V599Q4315 670 4234 709.5Q4153 749 4048 749ZM4562 730V0H4704V730ZM5050 730V125H4839V0H5403V125H5192V730ZM5464 730 5713 0H5945L6201 730H6055L5988 536H5670L5606 730ZM5947 416 5846 119H5809L5710 416ZM6329 730V0H6471V605H6766V730Z" />
          <rect x="6942" y="0" width="592.2" height="340" rx="80" fill="#C6F135" />
          <path fill="#0D1117" d="M7147.1 262.2Q7123.3 262.2 7106.3 253.9Q7089.2 245.6 7078.4 232Q7067.6 218.5 7062.5 202.8Q7057.3 187 7057.3 172.2V166.9Q7057.3 150.6 7062.6 134.6Q7067.9 118.6 7078.8 105.7Q7089.7 92.7 7106.4 84.9Q7123.1 77.1 7145.9 77.1Q7169.6 77.1 7187.9 86Q7206.1 94.9 7217 110.6Q7228 126.3 7229.9 147.4H7190.3Q7188.6 136.9 7182.6 129.4Q7176.6 122 7167.1 117.9Q7157.6 113.8 7145.9 113.8Q7134.1 113.8 7125 117.9Q7115.9 122 7109.8 129.4Q7103.6 136.9 7100.4 147.1Q7097.2 157.3 7097.2 169.8Q7097.2 182 7100.4 192.2Q7103.6 202.4 7110 210Q7116.4 217.5 7125.7 221.5Q7135.1 225.4 7147.1 225.4Q7165.3 225.4 7177.9 216.6Q7190.5 207.7 7193.2 192.1H7232.5Q7230.4 211.3 7219.7 227.2Q7209 243.2 7190.6 252.7Q7172.3 262.2 7147.1 262.2ZM7273.7 257.6V81H7342.6Q7364.4 81 7380.5 87.6Q7396.6 94.2 7405.2 107.1Q7413.8 120.1 7413.8 139.8V143.6Q7413.8 163 7405.2 175.8Q7396.6 188.5 7381 195L7425.6 257.6H7380L7341.8 201.4H7313V257.6ZM7313 114.3V170.5H7345.7Q7354.3 170.5 7360.7 167Q7367 163.5 7370.5 157.2Q7374 150.8 7374 142.4Q7374 134 7370.5 127.6Q7367 121.3 7360.7 117.8Q7354.3 114.3 7345.7 114.3Z" />
        </svg>
        <span className="mdcr-tagline">Desarrollo web en Costa Rica</span>
      </a>
    </div>
  );
}
