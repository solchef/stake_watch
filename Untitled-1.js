

const uploadToWordPress = async () => {





    const data =
	{
		"parent_id": parent.id,
		"child_id": children.id,
		"context": "child",
		"store_items_type": "replace/update",
		"meta": {
			"market_value": 100,
			"6m_change": 0.5,
			"group_type": "brands",
			"type_name": "Rolex",
			"historical_data": []
		}
	}

	 await axios.post('https://stakewatch.dubbydesign.com/wp-json/jet-rel/59', {
		headers: {
			'Authorization': 'Basic YXBpdXBkYXRlOjNnSzggVXpjdiBCY2lwIGFYVGogcXFQWCBlQXNk'
		},
		data

	}, {


	}, {})

    
}