import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  h1 {
    margin-top: 0;
    font-size: 1.5em;
  }

  .p {
    font-size: 1.2em;
    margin-bottom: 10px;
    margin-top: 0;
  }
`

const DonateButton = ({...other}) => (
    <form action="https://www.paypal.com/donate" method="post" target="_top" {...other}>
        <input type="hidden" name="hosted_button_id" value="J4DNSRBMJ6P9U"/>
        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit"
               title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button"/>
        {/*<img alt="" border="0" src="https://www.paypal.com/en_SK/i/scr/pixel.gif" width="1" height="1"/>*/}
    </form>)

const DonateButtonStyled = styled(DonateButton)`
  display: inline;
  vertical-align: middle;
`

const Description = () => {
    return (
        <Container>
            <h1>TeamSpeak 5 Channel Image Generator</h1>
            <div className={'p'}>Simple interactive tool for generating background images for channels in
                new <a href="https://teamspeak.com/en/downloads/#ts5" target={'_blank'} rel="noopener">TeamSpeak 5 beta client</a>.
                Upload any image and it will be resized and split into multiple images that you can simply use as
                banners on your channels.</div>

            <div className={'p'}>If you like the project you can buy me a beer 🍻 <DonateButtonStyled/> or contribute to the project
                on <a href="https://github.com/daco" target={'_blank'}>github (bug reports are welcomed)</a> !</div>

            <div className={'p'}>&copy; 2020 - <a href="mailto:padampasam@gmail.com" target={'_blank'}>Peter Adam</a></div>
        </Container>
    );
};

export default Description;
