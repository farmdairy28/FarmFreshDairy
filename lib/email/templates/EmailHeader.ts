export function renderEmailHeader(eyebrow: string = 'Farm Fresh Daily Doorstep Delivery'): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1B4D3E; border-top-left-radius: 16px; border-top-right-radius: 16px; overflow: hidden;">
      <tr>
        <td style="padding: 32px 24px; text-align: center;">
          <table align="center" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="text-align: center;">
                <div style="display: inline-block; width: 44px; height: 44px; background-color: #266B57; border-radius: 50%; line-height: 44px; text-align: center; color: #FFFFFF; font-size: 22px; margin-bottom: 12px;">
                  🥛
                </div>
                <h1 style="margin: 0; color: #FFFFFF; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">
                  FARM FRESH DAIRY
                </h1>
                <p style="margin: 6px 0 0 0; color: #CDE3DB; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">
                  ${eyebrow}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}
