import unittest

from app import app


class ApiSmokeTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.config.update(TESTING=True)
        cls.client = app.test_client()

    def test_lista_problemas(self):
        response = self.client.get("/problems")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.get_json(), list)

    def test_resultado_oficial(self):
        response = self.client.get("/problems/1/result")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "Optimal")
        self.assertAlmostEqual(data["valor_objetivo"], 500000.0)
        self.assertAlmostEqual(data["variaveis"]["Suporte Téc. Mensal"], 50.0)


if __name__ == "__main__":
    unittest.main()
