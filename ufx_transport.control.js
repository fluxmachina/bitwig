loadAPI(1);

host.defineController("Behringer", "UFX Transport", "1.0", "4CCE0D60-DFE3-11E4-B571-0800200C9A66");
host.defineMidiPorts(1, 1);
// Autodetect Behringer UFX Mixer
host.addDeviceNameBasedDiscoveryPair(["UFX1204 MIDI 1"], ["UFX1204 MIDI 1"]);
host.addDeviceNameBasedDiscoveryPair(["UFX1604 MIDI 1"], ["UFX1604 MIDI 1"]);

// This prefixes "ufx." to each control to make them more readable.
var ufx =
{
	REW : 91,
	FF : 92,
	STOP : 93,
	PLAY : 94,
	REC : 95
};

// Tell bitwig what is going to be controlled and watch the transport controls on screen.
function init()
{
	host.getMidiInPort(0).setMidiCallback(onMidi);
	transport = host.createTransportSection();
	transport.addIsPlayingObserver(function(on) // Is Bitwig's transport playing?
	{
		sendNoteOn(0, ufx.PLAY, on ? 127 : 0); // Don't understand this yet.
		sendNoteOn(0, ufx.STOP, on ? 0 : 127);
	});
	transport.addIsRecordingObserver(function(on) // Is Bitwig's transport recording?
	//transport.addLauncherOverdubObserver(function(on) // Handy for overdubbing in clips.
	{
		sendNoteOn(0, ufx.REC, on ? 127 : 0);
	});
}

//
function onMidi(status, data1, data2)
{
	//printMidi(status, data1, data2); // This is really helpfull, similar to MidiOX as shows data.
	switch (data1)
	{
		case ufx.REW:
			if (data2 > 0) // Otherwise press and release will both cause rewind.
			{
				transport.rewind();
			}
			sendMidi(144, ufx.REW, data2); // Send(midi note, note value, note velocity)
			break;
		case ufx.FF:
			if (data2 > 0)
			{
				transport.fastForward();
			}
			sendMidi(144, ufx.FF, data2);
			break;
		case ufx.STOP:
		if (data2 > 0)
			{
			transport.stop();
			}
			break;
		case ufx.PLAY:
			if (data2 > 0)
			{
			transport.play();
			}
			break;
		case ufx.REC:
		if (data2 > 0)
			{
			transport.record();
			//transport.toggleLauncherOverdub(); // Handy for overdubbing in clips.
			}
			break;		
	}
}

function exit()
{
}
