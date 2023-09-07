import 'dotenv/config';
import cors from 'cors';
import express, { Request, Response } from 'express';

import { calendar_v3 } from '@googleapis/calendar/build/v3'
import { calendar } from '@googleapis/calendar';

type Calendar = calendar_v3.Calendar;

const {
	API_KEY,
	CALENDAR_ID,
	CALENDAR_REGION
} = process.env;
const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());

// Get the available holiday events based on the region value.
// By default the region value is en.usa. 
app.get('/api/:region', async function (req: Request, res: Response) {
	const { region } = req.params;
	try {
		const calendarInstance: Calendar = calendar({
			version: 'v3',
			auth: API_KEY,
		});

		const holidayListParams: calendar_v3.Params$Resource$Events$List = {
			calendarId: `${region || CALENDAR_REGION}#${CALENDAR_ID}`,
		};

		const apiResponse = await calendarInstance.events.list(holidayListParams);
		const eventResults: calendar_v3.Schema$Events = apiResponse.data;
		res.json(eventResults);
	} catch (error) {
		res.status(400).json(error);
	}
})

app.listen(PORT, () => {
	console.log(`Running the server on port ${PORT}`)
})