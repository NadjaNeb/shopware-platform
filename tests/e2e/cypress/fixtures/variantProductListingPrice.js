export default {
    "id": "f1d2554b0ce847cd82f3ac9bd1c0dfca",
    "name": "Variant product",
    "productNumber": "TEST",
    "price": [
        {
            "gross": 110,
            "net": 110,
            "currencyId": "b7d2554b0ce847cd82f3ac9bd1c0dfca",
            "linked": false,
            "listPrice": {
                "gross": 120,
                "net": 120,
                "currencyId": "b7d2554b0ce847cd82f3ac9bd1c0dfca",
                "linked": false
            }
        }
    ],
    "stock": 1234,
    "tax": {
        "taxRate": 0,
        "name": "foo"
    },
    "manufacturer": {
        "id": "b7d2554b0ce847cd82f3ac9bd1c0dfca",
        "name": "Test variant manufacturer"
    },
    "manufacturerId": "b7d2554b0ce847cd82f3ac9bd1c0dfca",
    "properties": [
        {
            "id": "f1d2554b0ce847cd82f3ac9bd1c0dfba",
            "name": "red",
            "colorHexCode": "#ff0000",
            "group": {
                "id": "adf2554b0ce847cd82f3ac9bd1c0dfba",
                "name": "color",
                "displayType": "color"
            }
        },
        {
            "id": "f1d2554b0ce847cd82f3ac9bd1c0dfbb",
            "name": "green",
            "colorHexCode": "#00ff00",
            "groupId": "adf2554b0ce847cd82f3ac9bd1c0dfba"
        },
        {
            "id": "f1d2554b0ce847cd82f3ac9bd1c0dfbc",
            "name": "blue",
            "colorHexCode": "#0000ff",
            "groupId": "adf2554b0ce847cd82f3ac9bd1c0dfba"
        }
    ],
    "children": [
        {
            "productNumber": "TEST.1",
            "stock": 10,
            "options": [
                {"id": "f1d2554b0ce847cd82f3ac9bd1c0dfba"}
            ],
            "price": [
                {
                    "gross": 110,
                    "net": 110,
                    "currencyId": "b7d2554b0ce847cd82f3ac9bd1c0dfca",
                    "linked": false,
                    "listPrice": {
                        "gross": 120,
                        "net": 120,
                        "currencyId": "b7d2554b0ce847cd82f3ac9bd1c0dfca",
                        "linked": false
                    }
                }
            ]
        },
        {
            "productNumber": "TEST.2",
            "stock": 10,
            "options": [
                {"id": "f1d2554b0ce847cd82f3ac9bd1c0dfbb"}
            ],
            "price": [
                {
                    "gross": 110,
                    "net": 110,
                    "currencyId": "b7d2554b0ce847cd82f3ac9bd1c0dfca",
                    "linked": false,
                    "listPrice": {
                        "gross": 120,
                        "net": 120,
                        "currencyId": "b7d2554b0ce847cd82f3ac9bd1c0dfca",
                        "linked": false
                    }
                }
            ]
        },
        {
            "productNumber": "TEST.3",
            "stock": 10,
            "options": [
                {"id": "f1d2554b0ce847cd82f3ac9bd1c0dfbc"}
            ],
            "price": [
                {
                    "gross": 130,
                    "net": 130,
                    "currencyId": "b7d2554b0ce847cd82f3ac9bd1c0dfca",
                    "linked": false,
                    "listPrice": {
                        "gross": 140,
                        "net": 140,
                        "currencyId": "b7d2554b0ce847cd82f3ac9bd1c0dfca",
                        "linked": false
                    }
                }
            ]
        }
    ],
    "configuratorSettings": [
        {
            "id": "f1d2554b0ce847cd82f3ac9bd1c0dfaa",
            "optionId": "f1d2554b0ce847cd82f3ac9bd1c0dfba"
        },
        {
            "id": "f1d2554b0ce847cd82f3ac9bd1c0dfab",
            "optionId": "f1d2554b0ce847cd82f3ac9bd1c0dfbb"
        },
        {
            "id": "f1d2554b0ce847cd82f3ac9bd1c0dfac",
            "optionId": "f1d2554b0ce847cd82f3ac9bd1c0dfbc"
        }
    ],
    "variantListingConfig": {
        "displayParent": true,
        "mainVariantId": null,
        "configuratorGroupConfig": null
    },
}
