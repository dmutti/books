double mult(double z[], int n) 
{
     int i, j;
     i = 0;

     for (j = 0; j < n; j++) 
     {
	 i = i + j + 1;
	 z[i] = z[i] * (z[0] + 1.0);
     }

     return z[n];
}

