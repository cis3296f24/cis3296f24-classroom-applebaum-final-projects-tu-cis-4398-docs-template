import { expect } from 'chai';
import { shallow } from 'enzyme'; // For shallow rendering
import Index, { fullTranscriptGlobal } from '../path/to/Index'; // Adjust path accordingly
import React from 'react';
import sinon from 'sinon';

describe('Index Component Tests', () => {
  let wrapper;
  let startTimerSpy;
  let stopTimerSpy;
  let fetchStub;

  beforeEach(() => {
    wrapper = shallow(<Index />);
    startTimerSpy = sinon.spy(wrapper.instance(), 'startTimer');
    stopTimerSpy = sinon.spy(wrapper.instance(), 'stopTimer');
    fetchStub = sinon.stub(global, 'fetch'); // Mocking global fetch method
  });

  afterEach(() => {
    sinon.restore(); // Restore any spied or stubbed functions
  });

  it('should call startTimer when microphone is activated', () => {
    wrapper.find('#micbutton').simulate('click'); // Simulating mic button click
    expect(startTimerSpy.calledOnce).to.be.true;
  });

  it('should call stopTimer when microphone is deactivated', () => {
    wrapper.find('#micbutton').simulate('click'); // Activate the mic first
    wrapper.find('#micbutton').simulate('click'); // Deactivate the mic
    expect(stopTimerSpy.calledOnce).to.be.true;
  });

  it('should update word lists correctly on loadWordLists', async () => {
    const wordbankData = {
      curseWords: ['curse1', 'curse2'],
      fillerWords: ['filler1', 'filler2'],
    };
    fetchStub.resolves({ ok: true, json: () => wordbankData });

    await wrapper.instance().loadWordLists();

    expect(wrapper.state('wordbank')).to.deep.equal(['curse1', 'curse2']);
    expect(wrapper.state('fillerWords')).to.deep.equal(['filler1', 'filler2']);
  });

  it('should handle errors when word lists fail to load', async () => {
    fetchStub.rejects(new Error('Failed to load word list'));

    await wrapper.instance().loadWordLists();

    expect(wrapper.state('wordbank')).to.deep.equal([]);
    expect(wrapper.state('fillerWords')).to.deep.equal([]);
  });

  it('should correctly detect bad words and update state', () => {
    const detectedBadWord = 'curse1';
    wrapper.instance().handleBadWordDetected();
    
    // Assuming handleBadWordDetected sets isBadWordDetected to true for 1 second
    expect(wrapper.state('isBadWordDetected')).to.be.true;
    setTimeout(() => {
      expect(wrapper.state('isBadWordDetected')).to.be.false;
    }, 1000);
  });

  it('should correctly format time from seconds', () => {
    const formattedTime = wrapper.instance().formatTime(3661); // 1 hour, 1 minute, 1 second
    expect(formattedTime).to.equal('01:01:01');
  });

  it('should start and stop SpeechRecognition correctly', () => {
    const recognitionStartSpy = sinon.spy(window, 'SpeechRecognition');
    const recognitionStopSpy = sinon.spy(window, 'SpeechRecognition');

    wrapper.instance().speechToText(true, () => {}, [], []); // Start recognition
    expect(recognitionStartSpy.calledOnce).to.be.true;

    wrapper.instance().speechToText(false, () => {}, [], []); // Stop recognition
    expect(recognitionStopSpy.calledOnce).to.be.true;
  });
});
