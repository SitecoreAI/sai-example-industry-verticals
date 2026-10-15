import { useState, type FormEvent, type JSX } from 'react';

/** The reference site's agent search, with demo destinations kept local. */
export function AgentFinder({ placement }: { placement: 'hero' | 'footer' }): JSX.Element {
  const [insurance, setInsurance] = useState('');
  const [zip, setZip] = useState('');
  const ready = insurance !== '' && /^\d{5}(?:-\d{4})?$/.test(zip.trim());
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (ready) window.location.hash = '';
  }
  return (
    <div
      className={[
        'agent-search_agentSearch__BziNp agent-search_dark__2jUnO',
        placement === 'hero' ? 'heroBannerAgentSearch' : 'footer_footerAgentSearch__GuRD5',
      ].join(' ')}
    >
      <div className="agent-search_title__irugu as-title">Find an Agent</div>
      <form className="as-form" onSubmit={submit}>
        <label className="as-insuranceField">
          <div className="agent-search_label__l31Iw as-insuranceLabel">Insurance Type</div>
          <select
            name="agent_search"
            className="agent-search_insuranceTypeSelect__80ES2"
            value={insurance}
            onChange={(event) => setInsurance(event.target.value)}
          >
            <option value="">Please Select</option>
            <option value="IsBond">Bond</option>
            <option value="IsBusiness">Business</option>
            <option value="IsHomeAndAuto">Home and Auto</option>
          </select>
        </label>
        <label className="as-zipField">
          <div className="agent-search_label__l31Iw as-zipLabel">ZIP Code (required)</div>
          <input
            className="agent-search_input__kEdNm as-zipInput"
            name="zip"
            inputMode="numeric"
            autoComplete="postal-code"
            value={zip}
            required
            pattern="[0-9]{5}(-[0-9]{4})?"
            onChange={(event) => setZip(event.target.value)}
          />
        </label>
        <button
          className="button_btn__V5_h7 button_primary__fehsi as-submitBtn"
          type="submit"
          aria-label="Submit agent search"
          aria-disabled={!ready}
          disabled={!ready}
        >
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}
